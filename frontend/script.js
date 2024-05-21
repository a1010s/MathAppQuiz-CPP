document.addEventListener('DOMContentLoaded', () => {
  let questionsData = null;
  const questionsContainer = document.getElementById('questions');
  const resultContainer = document.getElementById('result');
  const submitButton = document.getElementById('submit');

  // Function to fetch questions from the backend
  function fetchQuestions() {
      fetch('http://localhost:9080/questions')
          .then(response => {
              if (!response.ok) {
                  throw new Error('Network response was not ok');
              }
              return response.json();
          })
          .then(data => {
              questionsData = data;
              displayQuestions();
          })
          .catch(error => console.error('Error fetching questions:', error));
  }

  // Function to display questions in the HTML
  function displayQuestions() {
      questionsData.forEach((question, index) => {
          const questionDiv = document.createElement('div');
          questionDiv.className = 'question-div';
          questionDiv.textContent = `${question.question} `;
          const input = document.createElement('input');
          input.type = 'text';
          input.id = `answer${index}`;
          questionDiv.appendChild(input);
          questionsContainer.appendChild(questionDiv);
      });
  }

  // Function to handle form submission
  function handleSubmit() {
      const userAnswers = [];
      questionsData.forEach((question, index) => {
          const answerInput = document.getElementById(`answer${index}`);
          userAnswers.push(parseInt(answerInput.value, 10));
      });

      fetch('http://localhost:9080/submit', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json'
          },
          body: JSON.stringify(userAnswers)
      })
      .then(response => {
          if (!response.ok) {
              throw new Error('Network response was not ok');
          }
          return response.json();
      })
      .then(data => {
          if (data && typeof data.score !== 'undefined') {
              resultContainer.textContent = `Your score: ${data.score}`;
              highlightAnswers(userAnswers, data.correctAnswers);
          } else {
              throw new Error('Invalid response format from the server');
          }
      })
      .catch(error => {
          console.error('Error submitting answers:', error);
          resultContainer.textContent = 'Error submitting answers. Please try again.';
      });
  }

  // Function to highlight the answers
  function highlightAnswers(userAnswers, correctAnswers) {
      userAnswers.forEach((answer, index) => {
          const answerInput = document.getElementById(`answer${index}`);
          if (answer !== correctAnswers[index]) {
              answerInput.style.backgroundColor = 'palevioletred';
          } else {
              answerInput.style.backgroundColor = 'lightgreen';
          }
      });
  }

  // Event listener for the submit button click event
  submitButton.addEventListener('click', handleSubmit);

  // Fetch questions from the backend when the page loads
  fetchQuestions();
});
