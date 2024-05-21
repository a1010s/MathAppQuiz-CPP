#include <httplib.h>
#include <fstream>
#include <sstream>
#include <vector>
#include <string>
#include <iostream> // Include for std::cerr and std::cout
#include "json.hpp"

using json = nlohmann::json;

struct Question {
    std::string question;
    int answer;
};

std::vector<Question> loadQuestions(const std::string &questionsFile) {
    std::vector<Question> questions;
    std::ifstream file(questionsFile);
    if (!file.is_open()) {
        std::cerr << "Error: Could not open file " << questionsFile << std::endl;
        return questions;
    } else {
        std::cout << "Successfully opened file " << questionsFile << std::endl;
    }
    std::string line;
    while (std::getline(file, line)) {
        std::istringstream iss(line);
        std::string question;
        int answer;
        if (iss >> question >> answer) {
            questions.push_back({question, answer});
        }
    }
    return questions;
}

int main() {
    std::vector<Question> questions = loadQuestions("backend/questions.txt");
    int totalScore = questions.size() * 10; // Calculate total score based on number of questions

    httplib::Server svr;

    // Set CORS headers for all routes
    svr.set_default_headers({
        {"Access-Control-Allow-Origin", "*"},
        {"Access-Control-Allow-Methods", "GET, POST, OPTIONS"},
        {"Access-Control-Allow-Headers", "Origin, Content-Type"}
    });

    svr.Get("/questions", [&questions](const auto& req, auto& res) {
        json response;
        for (const auto &q : questions) {
            response.push_back({{"question", q.question}});
        }
        res.set_content(response.dump(), "application/json");
    });

    svr.Options("/submit", [](const auto& req, auto& res) {
        res.set_header("Access-Control-Allow-Methods", "POST");
        res.set_header("Access-Control-Allow-Headers", "Content-Type");
        res.status = 200;  // Respond with HTTP OK status for preflight request
    });

    svr.Post("/submit", [&questions, totalScore](const auto& req, auto& res) {
        auto body = json::parse(req.body);
        int score = 0;
        std::vector<int> correctAnswers;
        for (size_t i = 0; i < questions.size(); ++i) {
            correctAnswers.push_back(questions[i].answer);
            if (body[i] == questions[i].answer) {
                score += 10; // Each correct answer is worth 10 points
            }
        }
        int percentage = (score * 100) / totalScore; // Calculate percentage
        json response = {{"score", percentage}, {"correctAnswers", correctAnswers}};
        res.set_content(response.dump(), "application/json");
    });

    svr.listen("0.0.0.0", 9080);

    return 0;
}
