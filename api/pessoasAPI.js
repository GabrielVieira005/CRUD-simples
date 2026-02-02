import { MongoClient, ObjectId } from "mongodb";

const client = new MongoClient(process.env.MONGO_URI)
let db

async function connectDB() {
    if(!db){
        await client.connect()
        db = client.db("TABELA")
    }
    return db
}

export default async function handler(req, res) {
    const db = await connectDB()
    const collection = db.collection("Pessoas")

    if(req.method === "GET"){
        const pessoa = await collection.find({}).toArray()
        return res.status(200).json(pessoa)
    }

    else if(req.method === "POST"){
        const {name, phone, cpf, age} = req.body

        if(!name) return res.status(400).json({message: "Nome é obrigatório"})
        if(!phone) return res.status(400).json({message: "Número de telefone é obrigatório"})
        if(!cpf) return res.status(400).json({message: "CPF é obrigatório"})
        if(!age) return res.status(400).json({message: "Idade é obrigatório"})

        
        const cpfExiste = await collection.findOne({cpf: cpf.trim()})

        if(cpfExiste){
            return{
                sucesso: false,
                erro: "CPF já cadastrado",
                mensagem: "CPF já está sendo usado"
            }
        }

        const result = await collection.insertOne({
            name: name.trim(),
            phone: phone.trim(),
            cpf: cpf.trim(),
            age: age.trim()
        })

        return res.status(201).json({
            message: "Pessoa adicionada com sucesso",
            id: result.insertedId
        })
    }else if(req.method === "DELETE") {
        const { id } = req.query
        await collection.deleteOne({ _id: new ObjectId(id)})

        res.status(200).json({ message: "Tarefa deletada com sucesso"})
    }else if(req.method === "PATCH"){
        const {name, phone, cpf, age} = req.body

        if(!name) return res.status(400).json({message: "Nome é obrigatório"})
        if(!phone) return res.status(400).json({message: "Telefone é obrigatório"})
        if(!cpf) return res.status(400).json({message: "CPF é obrigatório"})
        if(!age) return res.status(400).json({message: "Idade é obrigatória"})

        await collection.updateOne(
            {_id: new ObjectId(id)},
            {
                $set: {
                    name,
                    phone,
                    cpf,
                    age,
                    atualizadoem: new Date()
                }
            })
            res.status(200).json({message: "Pessoa atualizada com sucesso"})
    }

}