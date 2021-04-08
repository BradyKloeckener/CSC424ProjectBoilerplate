from flask import Flask
from flask import request
import pandas as pd
import numpy as np

app = Flask(__name__)

@app.route('/flask', methods = ['POST'])
def index():
    content = request.get_json()

    #print(content)
        
    orgDF = pd.json_normalize(content, record_path='orgs')
    joinedDF = pd.json_normalize(content, record_path= 'joinedOrgs')
    emailsDF = pd.json_normalize(content, record_path= 'userEmails')


    # for joined in userDF['email','OrganizationsJoined']:
    #     for org in orgDF['_id']:
    #         for item in joined:
    #             if org == item['org_id']:
    #                     print('match ' + org + ' ' + item['org_id'] + ' email: ' + email)
    #     #                 joinedDF[]


    print(orgDF.to_string()+ '\n')
    print(emailsDF.to_string()+ '\n')
    print(joinedDF.to_string()+ '\n')     

    values = []

    print(values)
    print('\n')

    #print(df.to_string() + '\n')

    # Assign 1s in places where the user has joined the organization and 0 if not
    #create an array that can later be cast to a pandas dataframe
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
    #print(userDF.to_string())

    #print(df2.to_string())


    #print(df.userData + '\n')
    
    return 'Flask Server Response http://localhost:5000/flask'

# @app.route('/flask2', methods = ['POST'])
# def test():
#     content = request.get_json()
#     print(content)
#     return 'Flask Server Response http://localhost:5000/flask2'


print('Hello from Flask')
if(__name__ == "__manin__"):
    app.run(port=5000, debug=True, threaded=True)