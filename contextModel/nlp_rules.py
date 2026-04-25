# from transformers import pipeline

# class SentenceGenerator:
#     def __init__(self):
#         print("Loading NLP model...")
#         self.generator = pipeline(
#             "text2text-generation",
#             model="t5-small"
#         )

#     def generate(self, words):
#         input_text = " ".join(words)

#         prompt = f"Convert this into a clear sentence: {input_text}"

#         result = self.generator(prompt, max_length=50)

#         return result[0]['generated_text']

class SentenceGenerator:
    def __init__(self):
        print("Rule-based NLP system loaded ✅")

    def generate(self, words):
        words_set = set(words)

        # 🔴 Emergency / Help
        if "help" in words_set:
            return "I need help immediately."

        # 💧 Basic Needs
        if "water" in words_set and "want" in words_set:
            return "I want water."

        if "food" in words_set and "want" in words_set:
            return "I want food."

        # 🏥 Medical Conditions
        if "pain" in words_set:
            if "stomach" in words_set:
                return "I have stomach pain."
            if "head" in words_set:
                return "I have a headache."
            if "chest" in words_set:
                return "I have chest pain."
            return "I am in pain."

        # 🧑‍⚕️ Doctor
        if "doctor" in words_set:
            return "I need a doctor."

        # 🤒 Feeling unwell
        if "feel" in words_set and "bad" in words_set:
            return "I feel unwell."

        # 🔁 Fallback (default)
        return self.simple_sentence(words)

    def simple_sentence(self, words):
        # fallback if no rule matched
        sentence = " ".join(words)
        sentence = sentence.capitalize()

        if not sentence.endswith("."):
            sentence += "."

        return sentence