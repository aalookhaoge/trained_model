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
        print("Advanced Rule-based NLP loaded ✅")

    def generate(self, words):
        words_set = set(words)
        sentences = []

        # 🔴 Emergency
        if "help" in words_set:
            sentences.append("I need help immediately")

        # 💧 Needs
        if "water" in words_set and "want" in words_set:
            sentences.append("I want water")

        if "food" in words_set and "want" in words_set:
            sentences.append("I want food")

        # 🏥 Pain
        if "pain" in words_set:
            if "stomach" in words_set:
                sentences.append("I am dealing with stomach pain")
            elif "head" in words_set:
                sentences.append("I am dealing with a severe headache")
            elif "chest" in words_set:
                sentences.append("I have chest pain")
            else:
                sentences.append("I am in pain")

        # 🧑‍⚕️ Doctor
        if "doctor" in words_set:
            sentences.append("I need a doctor")

        # 🤒 Feeling
        if "feel" in words_set and "bad" in words_set:
            sentences.append("I feel unwell")

        # 🔁 If nothing matched
        if not sentences:
            return self.simple_sentence(words)

        # ✅ Combine all sentences properly
        return self.combine_sentences(sentences)

    def combine_sentences(self, sentences):
        if len(sentences) == 1:
            return sentences[0] + "."

        # Join with comma
        combined = ", ".join(sentences)
        return combined + "."

    def simple_sentence(self, words):
        sentence = " ".join(words).capitalize()
        if not sentence.endswith("."):
            sentence += "."
        return sentence