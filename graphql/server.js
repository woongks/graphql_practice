import {ApolloServer, gql } from "apollo-server";

// Schema Definition Language
// type Query는 GET /~~ 와 같음. 무조건 존재해야 함.
// type Mutation은 POST PUT DELETE /~~ 와 같다.
// !는 required라는 뜻


let tweets = [
    {
        id:"1",
        text:"hello",
    },
    {
        id:"2",
        text:"hello2",
    },
]

let users = [
    {
        id: "1",
        firstname: "sw",
        lastname: "k",
    }
]

const typeDefs = gql`
    type User {
        id: ID!
        firstname: String!
        lastname: String!
        fullname: String!
    }
    type Tweet {
        id: ID!
        text: String!
        author: User
      }
    type Query {            
        allUsers: [User!]!
        allTweets: [Tweet!]!
        tweet(id: ID!): Tweet                        
    }
    type Mutation {
        postTweet(text: String!, userId: ID!): Tweet!
        deleteTweet(id: ID!): Boolean!
    }
`

const resolvers = {
    Query: {
        allTweets() {
            return tweets
        },
        tweet(root, {id}) {
            // 두번째 파라미터는 id를 객체로 갖고 있다.
            return tweets.find(tweet => tweet.id === id);
        },
        allUsers() {    // 특정 필드에 대해서 resolver 만들 수 있음.
            return users;
        }
    },
    Mutation: {
        postTweet(_, { text, userId }) {
            const newTweet = {
                id:(tweets.length + 1).toString(),
                text,
            };
            tweets.push(newTweet);
            return newTweet;},
        deleteTweet(_,{id}) {
            const tweet = tweets.find((tweet) => tweet.id === id);
            if (!tweet) return false;
            tweets = tweets.filter((tweet)=>{tweet.id !== id });
            return true;
        }},
    User: {
        fullname() {
            return "hello!";
        }
    },
}

const server = new ApolloServer({resolvers,typeDefs})

server.listen().then(({url}) => 
    console.log(`running on ${url}`))