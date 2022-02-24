import math
import random
import pandas as pd
import numpy as np
import re
import sys


#config global variables ---------------------

#FILE_NAME="D:\\Project Backup\\FinalVersion\\finalpms\\server\\python\\dialogues.csv"
FILE_NAME = "/home/bishal/MySpace/Final/finalpms/server/python/dialogues.csv"
ENCODING = "utf-8"

DEFAULT_MSG ="who is your father"
ERROR_MSG_1 = "Sorry! didn't understand you"
ERROR_MSG_2 = "no reply available right now"

SPECIAL_CHARS = ['*','?','/','+','#',')','(','!']
#----------------------------


class NaiveBayesClassifier():
    def fit(self,dataset):
        df,self.classes = self.__generate_X_y(dataset, return_df= True)

        n_samples = df.shape[0]
        n_classes = len(self.classes)
        self.features = list(df.columns[:-1]) 
        n_features = len(self.features)

        self._mean = np.zeros((n_classes,n_features),dtype=np.float32)
        self._var = np.zeros((n_classes,n_features),dtype=np.float32)
        self._prior_prob = np.zeros(n_classes,dtype=np.float32)

        for className in self.classes:
            x_c = df[df["classes"] == self.classes.index(className)]
            x_features = x_c.iloc[:,:-1]
            self._mean[self.classes.index(className)] = x_features.mean(axis=0)
            self._var[self.classes.index(className)] = x_features.var(axis=0)
            self._prior_prob[self.classes.index(className)] = x_features.shape[0] / float(n_samples)

    def predict(self, input_msg):
          X = self.__tokenization(input_msg)
          # transforming X as a row of the dataframe 
          matched_x = np.zeros(len(self.features))
          for word in X :
              if word in self.features :
                matched_x[self.features.index(word)] += 1
          input_x = np.array(matched_x) 

          # return "undefined class" if less than 50%  text matched to the dataset features
          if np.sum(input_x) / len(X) < 0.4:
            # print(np.sum(input_x)/len(X))
            return "undefined class"


          posteriors = []
          for className in self.classes:
              prior = self._prior_prob[self.classes.index(className)]
              likelihood = self._pdf(input_x,self._mean[self.classes.index(className)], self._var[self.classes.index(className)])
              log_likelihood = np.sum(np.log(likelihood +1))
              #posterier prob 
              post_prob = np.log(prior) + log_likelihood
              if not np.isnan(post_prob):
                posteriors.append(post_prob) # append 0 incase of nan value
              else:
                posteriors.append(0)
          # print(posteriors)
          # print(self.classes)
          return self.classes[np.argmax(posteriors)]

    def _pdf(self,X,mean,var):
        numerator =  np.exp(-(X - mean)**2 /(2*(var+0.000001)))
        denuminator  = (np.sqrt(2 * np.pi *(var+0.000001)))
        return numerator / denuminator 

    def __generate_X_y(self,df, return_df = False): #return features matrix
      vocabulary = self.__build_vocabulary(df["dialogues"])
      num_samples = df.shape[0]
      X = np.zeros((num_samples,len(vocabulary)),dtype=np.float32) # return matrix where each coloumns represents the vocabulary as a features and each rows corresponds to each message of the dataset
      y = np.zeros(num_samples,dtype=np.float32)

      classes = list(df["classes"].unique())

      for i in range(num_samples):
          message = df.iloc[i,0]
          msg_token = self.__tokenization(message)

          for msg_word in msg_token:
              if msg_word in vocabulary:
                  X[i,vocabulary.index(msg_word)] += 1
              y[i] = classes.index(df.iloc[i,1])
      
      if return_df: 
        return pd.DataFrame(np.column_stack((X,y)),columns=vocabulary+["classes"]),classes
      return X,y,classes,vocabulary


    def __tokenization(self,msg):
        #removing special characters 
        
        for i in SPECIAL_CHARS:
          msg = msg.replace(i,'')
        # white space removing 
        msg = re.sub(" +",' ',msg).strip()
        # lower casing
        msg = msg.lower()
        # tokkenizing 
        msg_token = msg.split(' ')
        # removing stopping words 
        #filtered_token = [x for x in msg_token if x not in stopwords]

        return msg_token

    def __build_vocabulary(self,messages): # extracts vocabulary from the training dataset ; vocabulary is a distinct words along with their unique positional value
        vocabulary = []
        index = 0
        for msg in messages:
            msg_token = self.__tokenization(msg) # tokenize and return normalized message 

            for token in msg_token:
                if token not in vocabulary: 
                  vocabulary.append(token)
        return vocabulary



def reply_generator(msg=sys.argv[1] ,file_name=FILE_NAME ,enc = ENCODING):
  #read csv file
  dialogues_df = pd.read_csv(file_name,encoding=enc)
 
  #model 
  classifier = NaiveBayesClassifier()
  classifier.fit(dialogues_df)
  p_class = classifier.predict(msg)
  
 

  if p_class == "undefined class":
    return ERROR_MSG_1

  #generate reply
  reply_texts = dialogues_df[dialogues_df["classes"]==p_class]["answers"].dropna()


  if len(reply_texts) == 0:
    return ERROR_MSG_2

  reply = reply_texts.iloc[random.randint(0,len(reply_texts)-1)]
  return reply



if __name__ == "__main__":
  print(reply_generator())

