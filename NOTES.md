curl -L https://github.com/yhirose/cpp-httplib/raw/master/httplib.h -o backend/httplib.h
curl -L https://github.com/nlohmann/json/releases/download/v3.9.1/json.hpp -o backend/json.hpp


docker buildx build --platform linux/arm64 -t backend-image --file backend/Dockerfile .
# docker build -t backend-image .
docker run -p 9080:9080 backend-image
# test: curl http://localhost:9080/questions


docker buildx build --platform linux/arm64 -t frontend-image --file frontend/Dockerfile .
# docker build -t frontend-image .
docker run -p 8000:8000 frontend-image


python3 -m http.server

