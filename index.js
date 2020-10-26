const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const { buildSchema } = require('graphql');

const schema = buildSchema(`
    input ProductInput {
        name : String
        price : Int
        description : String
    }

    type Product {
        id : ID!
        name : String
        price : Int
        description : String
    }

    type Query {
        getProduct ( id : ID! ) : Product
    }

    type Mutation {
        addProduct(input : ProductInput) : Product
    }
`);

const products = [{
    id : 1,
    name : '첫번째 제품',
    price : 2000,
    description : "하하하"
}, {
    id : 2,
    name : '두번째 제품',
    price : 1200,
    description : "호호호"
}]

const root = {
    getProduct : ({ id }) => products.find( product => product.id === parseInt(id) ),
    addProduct : ({ input }) => {
        input.id = parseInt(products.length + 1);
        products.push(input);
        return root.getProduct({id : input.id});
    }
}

const app = express();
app.use('/graphql', graphqlHTTP({
    schema : schema,
    rootValue : root,
    graphiql : true // 실제 서비스에서는 이걸 false로
}));

app.listen( 4000 , () => {
    console.log('running server port 4000');
})