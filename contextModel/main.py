# from nlp_model import SentenceGenerator
# from utils import clean_words

# # Simulated output from your sign detection system
# def get_detected_signs():
#     # Replace this later with your real model
#     return ["me", "water", "want"]

# def main():
#     # Step 1: Get detected words
#     raw_words = get_detected_signs()
#     print("Detected words:", raw_words)

#     # Step 2: Clean words
#     cleaned_words = clean_words(raw_words)
#     print("Cleaned words:", cleaned_words)

#     # Step 3: NLP sentence generation
#     nlp = SentenceGenerator()
#     sentence = nlp.generate(cleaned_words)

#     print("\nFinal Sentence:")
#     print(sentence)

# if __name__ == "__main__":
#     main()

from utils import clean_words
from nlp_rules import SentenceGenerator

# 🔹 Replace this with your actual sign detection output
def get_detected_signs():
    return ["me", "want", "help", "fever" "stomach"]

def main():
    raw_words = get_detected_signs()
    print("Detected words:", raw_words)

    cleaned_words = clean_words(raw_words)
    print("Cleaned words:", cleaned_words)

    nlp = SentenceGenerator()
    sentence = nlp.generate(cleaned_words)

    print("\nFinal Sentence:")
    print(sentence)

if __name__ == "__main__":
    main()