# def clean_words(words):
#     """
#     Normalize raw detected words
#     """
#     mapping = {
#         "me": "I",
#         "i": "I",
#         "want": "want",
#         "water": "water",
#         "pain": "pain",
#         "stomach": "stomach",
#         "help": "help"
#     }

#     cleaned = []
#     for w in words:
#         w = w.lower()
#         cleaned.append(mapping.get(w, w))

#     return cleaned

def clean_words(words):
    mapping = {
        "me": "I",
        "i": "I",
        "want": "want",
        "water": "water",
        "pain": "pain",
        "stomach": "stomach",
        "head": "head",
        "help": "help",
        "doctor": "doctor",
        "need": "need",
        "feel": "feel",
        "bad": "bad"
    }

    return [mapping.get(w.lower(), w.lower()) for w in words]