const express = require('express');
const app = express();
const port = 5000;

const mongoose = require('mongoose');

const cors = require('cors');
app.use(cors());

app.use(express.json());

mongoose.connect('mongodb+srv://Kimgrace:sir439@experiment.yistdbf.mongodb.net/', {
    // useNewUrlPaser: true,
    // useUnifiedTofology: true,
    // useCreateIndex: true,
    // useFindAndModify: false,
})
.then(() => console.log('MongoDB Connected'))
.catch((err) => {
    console.log(err);
});

// Experiment 스키마 및 모델 정의
const ExperimentSchema = new mongoose.Schema({
    Topic: {
        type: String,
        required: true
    },
    Hypothesis: {
        type: String,
        required: true
    },
    Materials: {
        type:String,
        required:true
    },
    Process :{
        type: String,
        required:true
    },
    Result:{
        type:String,
        required:true
    }
});

const Experiment = mongoose.model('Experiment', ExperimentSchema, 'experiment');

const initialData =  [
     {
          'Topic': 'Banana Browning Experiment',
          'Hypothesis': 'As the polyphenol oxidase decomposes, the polyphenols come into contact with air and browning will occur.',
          'Materials' : 'Cutting bananas and cool water, hot water, lemon water, salt water.',
          'Process':'Cut bananas into appropriate sizes and put them in cool water, hot water, lemon water, and salt water\n'
                    +'Observe the changes in bananas 12 hours later.',
         'Result': 'Listed in order of least browning, salt water, then lemon water, then plain water. In the case of salt water, chlorine ions blocked the access of oxygen in the air, and in the case of lemon water, the pH decreased and the activity of polyphenol oxidase decreased. In the case of bananas placed in water, browning is relatively less likely to occur because oxygen in the air is blocked.'
      },
      {
          'Topic': 'Structure and sprouting morphology of kidney beans',
          'Hypothesis': 'Kidney beans sprout from the pupil, and young roots emerge first. The color of young leaves is pale yellow.',
          'Materials' : '5-6 kidney beans, petri dish and cotton, tweezers',
          'Process': 'Put cotton soaked in water in a petri dish, place kidney beans on it, and observe sprouting after 2-3 days.',
          'Result' : 'Kidney beans sprout from the pupil, and young roots come out first. The color of young leaves is pale yellow.'
      },
      {
          'Topic': 'Kidney bean leaf and stem growth',
          'Hypothesis': 'In kidney beans, the main leaf comes out after the cotyledon leaves, and 2-3 leaves grow from the petiole and the end of the stem until the flower blooms.',
          'Materials' : '5-6 kidney beans, petri dish and cotton, tweezers',
          'Process' : 'Look at the growth and change of cotyledons.\n'
                    +'Observe the changes in branches and leaves.\n'
                    +'Examine the growth of the stem and the change in length.',
          'Result' : 'In kidney beans, after the cotyledon leaves, the main leaves come out, and 2-3 leaves grow from the petiole and the end of the stem until the flower blooms.'
      },
      {
          'Topic': 'Dandelion Flower Structure and Sleep Movement',
          'Hypothesis': 'Flowers repeat dormancy for several days and eventually wither and the calyx shrinks. And in the closed calyx, the ovary at the base of the pistil gradually swells up to become a seed.',
          'Materials' : 'Dandelion flower, scissors, flowerpot, soil',
          'Process': 'Cut a dandelion flower in full bloom vertically and observe it.\n'
                    +'Take a dandelion tree that has just started to bloom by the root and plant it in a pot, then observe the change in the flower for 2-3 days.',
          'Result': 'The flower repeats the sleep movement for several days and finally withers and the calyx shrinks. And in the closed calyx, the ovary at the base of the pistil gradually swells up and grows into a seed. At this time, the papillary hair and the papillary stalk also grow long.'
      },
      {
          'Topic': 'The structure of sunflower flowers and fruits',
          'Hypothesis': 'At first glance, a sunflower flower looks like a single large flower, but in fact it is a collection of small flowers. Examine the difference and structure of the inner and outer flowers, and also observe the appearance of fruits and seeds.',
          'Materials' : 'Sunflower',
          'Process': 'Observe the order in which sunflower flowers bloom and the shape of the flowers.\n'
                    +'Observe the structure of the inner and outer flowers.\n'
                    +'Observe the shape of fruits and seeds.',
          'Result' : 'Flowers bloom from the outside to the inside center, and small flowers are gathered in a disk shape at the top of the stem.'
      },
      {
          'Topic': 'prism experiment',
          'Hypothesis': 'Observe how a prism separates white light (white light) into its constituent colors, and understand how different colors are refracted by the prism at different angles through experimentation.',
          'Materials' : 'Prism',
          'Process' : 'Place the light source of the light box mode on a white piece of paper, and turn the wheel to select a single white light beam.\n'
                    +'Place the trapezoid as shown in the figure below. In this experiment, the pointed tip of the trapezoid acts as a prism, so the light beam is placed close to the tip of the trapezoid to allow maximum transmission of light.\n'
                    +'When the trapezoid is rotated counterclockwise in the figure, the angle (θ) of the transmitted light increases. Observe and record any changes in color separation with rotation.',
          'Result' : 'The refraction of light can be separated according to the refractive index for each wavelength.'
      },
      {
          'Topic': 'Tuning fork experiments',
          'Hypothesis': 'Depending on the strength of the tapping, a different frequency will occur.',
          'Materials' : 'Tuning fork, bottled water',
          'Process' : 'Place a tuning fork on the surface of water filled with water\n'
                    +'Tap the tuning fork placed on the surface of the water\n'
                    +'Measure and record the frequencies according to the strength of the tapping.',
          'Result' : 'The wavelength of water also changes according to the frequency of vibration.'
      }
];

// 데이터가 중복되지 않을 경우에만 저장
(async () => {
    try {
        for (const data of initialData) {
            const query = {Topic: data.Topic, Hypothesis:data.Hypothesis, Materials:data.Materials, Process:data.Process, Result:data.Result};
            const existingExperiment = await Experiment.findOne(query);
            if (!existingExperiment) {
                const experiment = new Experiment(data);
                await experiment.save();
                console.log(`Initial data added: ${data.Topic}`);
            } else {
                console.log(`Initial data already exists: ${data.Topic}`);
            }
        }
    } catch (error) {
        console.error(error);
    }
})();

app.get('/api/experiments', async (req, res) => {
    try {
        const experiments = await Experiment.find({});
        res.json(experiments);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.get('/api/search', async (req, res) => {
    const search = req.query.search;

    const foundTopics = new Set();
    const foundHypotheses = new Set();
    const foundMaterials = new Set();
    const foundProcess = new Set();
    const foundResult = new Set();

    // 정확한 일치 검색
    const exactMatches = await Experiment.find({ "Topic": search }, { "_id": 0 });
    for (const x of exactMatches) {
        const topic = x.Topic;
        const hypothesis = x.Hypothesis;
        const materials = x.Materials;
        const Process = x.Process;
        const Result = x.Result;

        if (!foundTopics.has(topic)) {
            foundTopics.add(topic);
            foundHypotheses.add(hypothesis); // 정확한 일치 검색의 경우 해당 Hypothesis도 저장
            foundMaterials.add(materials);
            foundProcess.add(process);
            foundResult.add(result);
        }
        break; // 첫 번째 매치만 찾고 종료
    }

    if (foundTopics.size === 0) {
        const keyWords = search.split(" ");

        // 부분 일치 검색
        for (const keyword of keyWords) {
            const regex = new RegExp(keyword, "i");
            const partialMatches = await Experiment.find({ "Topic": { $regex: regex } }, { "_id": 0 });
            for (const y of partialMatches) {
                const topic = y.Topic;
                const hypothesis = y.Hypothesis;
                const materials = y.Materials;
                const process = y.Process;
                const result = y.Result;

                if (!foundTopics.has(topic)) {
                    foundTopics.add(topic);
                    foundHypotheses.add(hypothesis); // 부분 일치 검색의 경우 해당 Hypothesis도 저장
                    foundMaterials.add(materials);
                    foundProcess.add(process);
                    foundResult.add(result);
                }
            }
        }
    }

    if (foundTopics.size === 0) {
        res.status(404).json({ message: "No matching document found." });
    } else {
        const results = Array.from(foundTopics).map((topic) => {
            return { topic, hypothesis: Array.from(foundHypotheses), materials: Array.from(foundMaterials), process: Array.from(foundProcess), result: Array.from(foundResult) };
        });
        res.status(200).json(results); // 결과를 JSON으로 반환
    }
});


app.listen(port, () => console.log(`${port}Port`));
