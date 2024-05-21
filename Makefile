CXX = g++
CXXFLAGS = -std=c++14 -Ibackend
TARGET = backend/mathquiz
SRC = backend/main.cpp

# Define Docker image names
BACKEND_IMAGE = backend-image
FRONTEND_IMAGE = frontend-image

all: compile build-docker run-docker

$(TARGET): $(SRC)
	$(CXX) $(CXXFLAGS) -o $(TARGET) $(SRC)

compile: $(TARGET)

build-docker:
	# Build backend Docker image
	docker buildx build --platform linux/arm64 -t $(BACKEND_IMAGE) --file backend/Dockerfile .

	# Build frontend Docker image
	docker buildx build --platform linux/arm64 -t $(FRONTEND_IMAGE) --file frontend/Dockerfile .

run-docker:
	# Run backend Docker container
	docker run -d -p 9080:9080 $(BACKEND_IMAGE)

	# Run frontend Docker container
	docker run -p 8000:8000 $(FRONTEND_IMAGE)

clean:
	rm -f $(TARGET)
