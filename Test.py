import pymongo
from transformers import AutoTokenizer

connection = pymongo.MongoClient("mongodb+srv://Kimgrace:sir439@experiment.yistdbf.mongodb.net/")

db = connection.experiment

doc = [
     {
          'Topic': 'Exploring fruit',
          'Hypothesis': 'Of salt water, vinegar or hot water, fruits in brine brown the least.'
      },
      {
          'Topic': 'Structure and sprouting morphology of kidney beans',
          'Hypothesis': 'Kidney beans sprout from the pupil, and young roots emerge first. The color of young leaves is pale yellow.'
      },
      {
          'Topic': 'Leaves and stems of kidney bean',
          'Hypothesis': 'In kidney beans, the main leaf comes out after the cotyledon leaves, and 2-3 leaves grow from the petiole and the end of the stem until the flower blooms.'
      },
      {
          'Topic': 'Structure of Dandelion Flower and Sleep Movement',
          'Hypothesis': 'Flowers repeat dormancy for several days and eventually wither and the calyx shrinks. And in the closed calyx, the ovary at the base of the pistil gradually swells up to become a seed.'
      },
      {
          'Subject': 'Observe where the flowers and leaves that bloom on the branch come from and what their shape is',
          'Hypothesis': 'The winter buds of peaches are formed on the leaf shed and are surrounded by scale leaves. Winter buds contain both leaf buds and flower buds.'
      },
      {
          'Topic': 'prism experiment',
          'Hypothesis': 'If you observe natural light through a prism, you can observe the division into the different colors of the rainbow.'
      },
      {
          'Topic': 'Tuning fork experiments',
          'Hypothesis': 'Place a tuning fork on the surface of water filled with water and vibrate it. Vibration can be observed through the wavefront of water.'
      }
]

db.experiment.insert_many(doc)

search = input()

found_topics = set()

# 정확한 일치 검색
for x in db.experiment.find({"Topic": search}, {"_id": 0}):
    topic = x.get("Topic")
    if topic not in found_topics:  # 이미 출력한 주제인지 확인
        print(x)
        found_topics.add(topic)  # 출력한 주제 기록
    break

if not found_topics:
    key_words = search.split()

    # 부분 일치 검색
    for keyword in key_words:
        for y in db.experiment.find({"Topic": {"$regex": keyword, "$options": "i"}}, {"_id": 0}):
            topic = y.get("Topic")
            if topic not in found_topics:  # 이미 출력한 주제인지 확인
                print(y)
                found_topics.add(topic)  # 출력한 주제 기록

if not found_topics:
    print("No matching document found.")