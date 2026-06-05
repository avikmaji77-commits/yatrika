# Use a Python image compatible with the backend requirements
FROM python:3.14-slim

# Set working directory
WORKDIR /app

# Prevent Python from writing .pyc files and buffer stdout/stderr
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# Install dependencies
COPY requirements.txt ./
RUN python -m pip install --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt

# Copy backend source
COPY . .

# Expose the Flask port
EXPOSE 5000

# Run the backend server
CMD ["python", "app.py"]
