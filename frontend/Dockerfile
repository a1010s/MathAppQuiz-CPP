# Use a base image with Python installed
FROM python:3.9-slim

# Set the working directory inside the container
WORKDIR /app

# Copy the frontend files into the container
COPY frontend /app

# Copy the files directory into the container
COPY files /app/files

# Expose port 8000 (assuming you are using port 8000 for the frontend)
EXPOSE 8000

# Command to run the Python HTTP server for serving the frontend
CMD ["python3", "-m", "http.server", "8000"]
