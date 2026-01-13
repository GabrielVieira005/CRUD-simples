const API = "../api/pessoasAPI.js"

async function carregarPessoas() {
    try{
        const res = await fetch(API)

        if(!res.ok){
            throw new Error(`Erro HTTP : ${res.status}`)
        }

        const pessoas = await res.json()
        const ul = document.getElementById("pessoas-list")
        ul.innerHTML = ""

        if(pessoas.length === 0){
            const li = document.createElement("li")

            li.className = "empty-message"
            li.innerHTML = "Nenhuma pessoa adicionada no momento"
            ul.appendChild(li)
            return
        }

        pessoas.forEach(p => {

            const li = document.createElement("li")

            const pessoaContent = document.createElement("div")
            pessoaContent.className = "pessoa-content"

            const name = document.createElement("div")
            name.className = "nomePessoa"
            name.textContent = p.name

            const phone = document.createElement("div")
            phone.className = "telefonePessoa"
            phone.textContent = p.phone

            const cpf = document.createElement("div")
            cpf.className = "cpfPessoa"
            cpf.textContent = p.cpf

            const idade = document.createElement("div")
            idade.className = "idadePessoa"
            idade.textContent = p.age

            pessoaContent.appendChild(name)
            pessoaContent.appendChild(phone)
            pessoaContent.appendChild(cpf)
            pessoaContent.appendChild(idade)   

            li.appendChild(pessoaContent)
            ul.appendChild(li)
            
            //Faltou criar botão de deletar e editar pessoas(Feature pra depois)
        });

    }catch(error){
        console.error("Erro ao carregar tarefas")
        const ul = document.getElementById("pessoas-list")
        ul.innerHTML = '<li id="empty-message">Erro ao carregar as pessoas</li>'
        }
    }

    async function adicionarPessoa() {
        const nameInput = document.getElementById("nomeInput")
        const telefoneInput = document.getElementById("telefoneInput")
        const cpfInput = document.getElementById("cpfInput")
        const idadeInput = document.getElementById("idadeInput")

        if(!nameInput.value || !telefoneInput.value || !cpfInput.value || !idadeInput.value){
            alert("Todos os campos são obrigatorios")
            return
        }

        //Depois fazer regex para numero de celular e CPF

        try{
            const response = await fetch(API,{
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({
                    name: nameInput.value,
                    phone: telefoneInput.value,
                    cpf: cpfInput.value,
                    age: idadeInput.value
                })
            })

            const data = await response.json()

            if(!response.ok){
                alert(data.message || "Erro ao adicionar pessoa")
            }
            
            nameInput.value = ""
            telefoneInput.value = ""
            cpfInput.value = ""
            idadeInput.value = ""

            carregarPessoas()
            alert("Pessoa adicionada com sucesso")
        }catch(error){
            console.error("Erro", error)
            alert("Erro ao adicionar pessoa")
        }
    
    }

    document.getElementById("add").addEventListener("click", adicionarPessoa)
    carregarPessoas()