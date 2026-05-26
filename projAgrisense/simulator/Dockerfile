FROM python:3.11-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY *.py .
ENV SIMULATOR=sim_heart_rate
CMD ["sh", "-c", "python $SIMULATOR.py"]
