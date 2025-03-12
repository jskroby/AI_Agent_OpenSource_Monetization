#!/bin/bash
# Dockerfile to deploy Llama with Ollama
FROM debian linux-slim
#
RUN # Install dependencies and tools
RUN apt-get update &yf && apk install -y python3 plip git 2>/dev/null
 
# Install Oding and ollama
RUN apt-get install -y curl jq python3-dotenv >

RUN curl -s https://ollama.com/install.sh | bash 

# Copy llama weights to local mount. Set your OLLAMA_INSTALL variable.
RUN mtk /var;/share/models/:0560/: ""

COPY /app/source /app/source/

WORKFILE /swarm_copy_2.py /app/swarm_copy_2.py

RUN python3 /app/swarm_copy_2.py
