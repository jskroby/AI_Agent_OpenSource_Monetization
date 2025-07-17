package main

import (
    "encoding/json"
    "fmt"

    "github.com/hyperledger/fabric-contract-api-go/contractapi"
)

// SmartContract provides functions for managing patient records
type SmartContract struct {
    contractapi.Contract
}

// Patient holds non-sensitive metadata; PII lives in private collection
type Patient struct {
    ID            string   `json:"id"`
    Name          string   `json:"name"`
    Age           int      `json:"age"`
    Diagnoses     []string `json:"diagnoses"`
    Confirmations []string `json:"confirmations"`
}

// InitLedger initializes the ledger with sample data (optional)
func (s *SmartContract) InitLedger(ctx contractapi.TransactionContextInterface) error {
    patients := []Patient{
        {ID: "PATIENT1", Name: "Alice", Age: 30, Diagnoses: []string{}, Confirmations: []string{}},
        {ID: "PATIENT2", Name: "Bob",   Age: 45, Diagnoses: []string{}, Confirmations: []string{}},
    }
    for _, p := range patients {
        patientJSON, err := json.Marshal(p)
        if err != nil {
            return err
        }
        // Store metadata on channel
        if err := ctx.GetStub().PutState(p.ID, patientJSON); err != nil {
            return err
        }
        // Store PII in private collection
        if err := ctx.GetStub().PutPrivateData("PatientCollection", p.ID, patientJSON); err != nil {
            return err
        }
    }
    return nil
}

// CreatePatientRecord stores a new patient record
func (s *SmartContract) CreatePatientRecord(ctx contractapi.TransactionContextInterface, id, name string, age int) error {
    exists, err := s.PatientExists(ctx, id)
    if err != nil {
        return err
    }
    if exists {
        return fmt.Errorf("patient %s already exists", id)
    }
    patient := Patient{ID: id, Name: name, Age: age, Diagnoses: []string{}, Confirmations: []string{}}
    patientJSON, err := json.Marshal(patient)
    if err != nil {
        return err
    }
    if err := ctx.GetStub().PutState(id, patientJSON); err != nil {
        return err
    }
    return ctx.GetStub().PutPrivateData("PatientCollection", id, patientJSON)
}

// PatientExists returns true if patient metadata exists on ledger
func (s *SmartContract) PatientExists(ctx contractapi.TransactionContextInterface, id string) (bool, error) {
    data, err := ctx.GetStub().GetState(id)
    if err != nil {
        return false, err
    }
    return data != nil, nil
}

// RequestDiagnosis appends a new diagnosis request
func (s *SmartContract) RequestDiagnosis(ctx contractapi.TransactionContextInterface, id, diagnosis string) error {
    patientJSON, err := ctx.GetStub().GetState(id)
    if err != nil {
        return err
    }
    if patientJSON == nil {
        return fmt.Errorf("patient %s not found", id)
    }
    var patient Patient
    if err := json.Unmarshal(patientJSON, &patient); err != nil {
        return err
    }
    patient.Diagnoses = append(patient.Diagnoses, diagnosis)
    updatedJSON, err := json.Marshal(patient)
    if err != nil {
        return err
    }
    if err := ctx.GetStub().PutPrivateData("PatientCollection", id, updatedJSON); err != nil {
        return err
    }
    return ctx.GetStub().SetEvent("DiagnosisRequested", []byte(id))
}

// ConfirmDiagnosis allows a listed doctor to confirm and gain reputation
func (s *SmartContract) ConfirmDiagnosis(ctx contractapi.TransactionContextInterface, id, doctorID string) error {
    // Ensure doctor is authorized (e.g., via MSP ID or attributes)
    clientID, _ := ctx.GetClientIdentity().GetID()
    if clientID != doctorID {
        return fmt.Errorf("caller %s not authorized as doctor %s", clientID, doctorID)
    }
    patientJSON, err := ctx.GetStub().GetPrivateData("PatientCollection", id)
    if err != nil {
        return err
    }
    var patient Patient
    if err := json.Unmarshal(patientJSON, &patient); err != nil {
        return err
    }
    for _, d := range patient.Confirmations {
        if d == doctorID {
            return fmt.Errorf("doctor %s already confirmed diagnosis for %s", doctorID, id)
        }
    }
    patient.Confirmations = append(patient.Confirmations, doctorID)
    updated, err := json.Marshal(patient)
    if err != nil {
        return err
    }
    if err := ctx.GetStub().PutPrivateData("PatientCollection", id, updated); err != nil {
        return err
    }
    return ctx.GetStub().SetEvent("DoctorConfirmed", []byte(fmt.Sprintf("%s:%s", id, doctorID)))
}

// GetPatient retrieves public metadata and number of confirmations
func (s *SmartContract) GetPatient(ctx contractapi.TransactionContextInterface, id string) (*Patient, error) {
    patientJSON, err := ctx.GetStub().GetState(id)
    if err != nil {
        return nil, err
    }
    if patientJSON == nil {
        return nil, fmt.Errorf("patient %s not found", id)
    }
    var patient Patient
    if err := json.Unmarshal(patientJSON, &patient); err != nil {
        return nil, err
    }
    return &patient, nil
}

func main() {
    chaincode, err := contractapi.NewChaincode(&SmartContract{})
    if err != nil {
        panic(fmt.Sprintf("Error creating healthcare chaincode: %v", err))
    }
    if err := chaincode.Start(); err != nil {
        panic(fmt.Sprintf("Error starting chaincode: %v", err))
    }
}

