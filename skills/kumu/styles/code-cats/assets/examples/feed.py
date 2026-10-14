names = ["Mochi", "Nori", "Taro", "Ume", "Kiki"]
fed = []


def feed(cat):
    fed.append(cat)


cats = names
for cat in cats:
    feed(cat)
assert fed == names
print("All fed!")
