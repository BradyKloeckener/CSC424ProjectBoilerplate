from flask import Flask
from flask import request
import pandas as pd
import numpy as np
import scipy.spatial

app = Flask(__name__)

@app.route('/flask', methods = ['POST'])
def index():
    content = request.get_json()

    #print(content)
    user = content['user']
    orgDF = pd.json_normalize(content, record_path='orgs')
    joinedDF = pd.json_normalize(content, record_path= 'joinedOrgs')
    emailsDF = pd.json_normalize(content, record_path= 'userEmails')



    values = []


    #print(df.to_string() + '\n')

    # Assign 1s in places where the user has joined the organization and 0 if not
    # create an array that can later be cast to a pandas dataframe
    i = 0
    for joined in joinedDF['OrganizationsJoined']:
        email = emailsDF.at[i, 'email']
        obj = {'email': email}
        for org in orgDF['_id']:
            if joined == []:
                obj[org] = 0
                continue
            for item in joined: 

                if org == item['org_id']:
                    obj[org] = 1
                    break
                else:
                    obj[org] = 0
        values.append(obj)
        i += 1

    df = pd.DataFrame(values)    
    df = df.set_index('email')

    print(df.to_string() + '\n')

    #jaccard distance = TT/(TT + TF + FT)
    #Calculate the similarity between users
    # The closer to 0 the more similar two users are 1 being no similarity
    jaccard = scipy.spatial.distance.cdist(df, df, metric= 'jaccard')

    userDistance = pd.DataFrame(jaccard, columns= df.index.values, index=df.index.values)
    print(userDistance)

    #For each user create a of all the other users ordered from most similar to least similar
    userRankings = {}

    for u in userDistance.columns:
        distance = userDistance[u].nsmallest(len(userDistance))
        data = {u: [i for i in distance.index if i != u]}
        userRankings.update(data)
    

    print(userRankings)
    print(user, userRankings[user])
    

    
    
    return 'Flask Server Response http://localhost:5000/flask'

# @app.route('/flask2', methods = ['POST'])
# def test():
#     content = request.get_json()
#     print(content)
#     return 'Flask Server Response http://localhost:5000/flask2'


print('Hello from Flask')
if(__name__ == "__manin__"):
    app.run(port=5000, debug=True, threaded=True)