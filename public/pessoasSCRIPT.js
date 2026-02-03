const API = "../api/pessoasAPI.js"

async function carregarPessoas() {
    try {
        const res = await fetch(API)

        if (!res.ok) {
            throw new Error(`Erro HTTP : ${res.status}`)
        }

        const pessoas = await res.json()
        const ul = document.getElementById("pessoas-list")
        ul.innerHTML = ""

        if (pessoas.length === 0) {
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

            const pessButtons = document.createElement("div")
            pessButtons.className = "pessButtons"

            const btnDelete = document.createElement("button")
            btnDelete.className = "btnDelete"
            btnDelete.textContent = "⛔"
            btnDelete.title = "Deletar Pessoa"
            btnDelete.onclick = () => deletarPessoa(String(p._id))

            const btnEdit = document.createElement("button")
            btnEdit.className = "btnEdit"
            btnEdit.textContent = "✏️"
            btnEdit.title = "Editar Pessoa"
            btnEdit.onclick = () => editarPessoa(String(p._id))

            pessButtons.appendChild(btnEdit)
            pessButtons.appendChild(btnDelete)
            li.appendChild(pessoaContent)
            li.appendChild(pessButtons)
            ul.appendChild(li)


        });

    } catch (error) {
        console.error("Erro ao carregar pessoas")
        const ul = document.getElementById("pessoas-list")
        ul.innerHTML = '<li id="empty-message">Erro ao carregar as pessoas</li>'
    }
}

async function adicionarPessoa() {
    const nameInput = document.getElementById("nomeInput")
    const telefoneInput = document.getElementById("telefoneInput")
    const cpfInput = document.getElementById("cpfInput")
    const idadeInput = document.getElementById("idadeInput")

    if (!nameInput.value || !telefoneInput.value || !cpfInput.value || !idadeInput.value) {
        alert("Todos os campos são obrigatorios")
        return
    }

    try {
        const response = await fetch(API, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                name: nameInput.value,
                phone: telefoneInput.value,
                cpf: cpfInput.value,
                age: idadeInput.value
            })
        })

        const data = await response.json()

        if (!response.ok) {
            alert(data.message || "Erro ao adicionar pessoa")
        }

        nameInput.value = ""
        telefoneInput.value = ""
        cpfInput.value = ""
        idadeInput.value = ""

        carregarPessoas()
        alert("Pessoa adicionada com sucesso")
    } catch (error) {
        console.error("Erro", error)
        alert("Erro ao adicionar pessoa")
    }

}

async function deletarPessoa(id) {
    await fetch(API, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            id: id,
            status: "Deletada"
        })
    })

}

async function editarPessoa(id) {
    //res recebe a API aberta
    const res = await fetch(API)
    //pessoas secebe o res(API aberta) em formato json
    const pessoas = await res.json()
    //pessoa recebe esse json e procura nele uma pessoa específica pelo ID
    const pessoa = pessoas.find(p => String(p._id) === id)

    //Se não existirem pessoas recebemos um alerta nos informando disso
    if (!pessoa) {
        alert("Não existem pessoas ainda")
        return
    }

    //Nesses campos de prompt fazemos a edição das variáveis que contem o objeto pessoa
    const novoNome = prompt("Digite o novo nome: ", pessoa.nome)
    if (novoNome == null) return

    const novoTelefone = prompt("Digite o novo telefone ", pessoa.telefone)
    if (novoTelefone == null) return

    const novoCpf = prompt("Digite o novo CPF: ", pessoa.cpf)
    if (novoCpf == null) return

    const novoIdade = prompt("Digite a nova idade ", pessoa.idade)
    if (novoIdade == null) return

    //Dizemos pro frontend usar usar o método PATCH quando se comunicar com a API
    try {
        //Fazemos uma promisse dizendo todas as variaveis do objeto pessoa
        const response = await fetch(API, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                id: id,
                nome: novoNome,
                telefone: novoTelefone,
                cpf: novoCpf,
                idade: novoIdade
            })
        })

        //Data recebe toda essa resposta com as variáveis modificadas
        const data = await response.json()

        //Se der erro no response (resposta) somos informados que não atualizamos a pessoa com sucesso
        if (!response.ok) {
            alert(data.message || "Erro ao atualizar pessoa")
            return
        }
        //Carregamos as pessoas novamente
        carregarPessoas()
        alert("A pessoa foi atualizada com sucesso")

    } catch (error) {
        console.error("Erro:", error)
        alert("Erro ao atualizar pessoa")

    }

}

async function searchBar() {
        //Pegamos  o HTML da barra de pesquisa
        const searchInput = document.getElementById("search-bar");
        //Adicionamos um eventListener para pesquisa
        searchInput.addEventListener('input', async function (e) {
            //Variável termo recebe o "alvo" da pesquisa
            const termo = e.target.value.toLowerCase();

            //Se não tiver nada escrito no termo ele só carrega a tabela completa
            if (!termo) {
                carregarPessoas();
                return;
            }

            //res recebe a API aberta
            const res = await fetch(API);
            //pessoas recebe a res em formato json
            const pessoas = await res.json();
            //ul recebe a lista de pessoas do HMTL
            const ul = document.getElementById("pessoas-list");

            //Aplicamos o filtro procurando por cada uma das variáveis da nossa tabela pessoas
            const filtradas = pessoas.filter(p =>
                p.name.toLowerCase().includes(termo) ||
                p.phone.includes(termo) ||
                p.cpf.includes(termo) ||
                p.age.toString().includes(termo)
            );

            //innerHTML com mensagem representando a tabela vazia
            ul.innerHTML = filtradas.length ? "" : '<li class="empty-message">Nenhuma pessoa encontrada</li>';

            //Renderizando a tabela com os filtros
            filtradas.forEach(p => {
                //Criamos uma li (Lista)
                const li = document.createElement("li");
                //Nossa lista recebe com um innerHTML as pessoas que foram filtradas pela barra de pesquisa
                li.innerHTML = `
                <div class="pessoa-content">
                    <div class="nomePessoa">${p.name}</div>
                    <div class="telefonePessoa">${p.phone}</div>
                    <div class="cpfPessoa">${p.cpf}</div>
                    <div class="idadePessoa">${p.age}</div>
                </div>
                <div class="pessButtons">
                    <button class="btnEdit" onclick="editarPessoa('${p._id}')" title="Editar">✏️</button>
                    <button class="btnDelete" onclick="deletarPessoa('${p._id}')" title="Deletar">⛔</button>
                </div>
            `;
                //Renderizando a tabela filtrada
                ul.appendChild(li);
            });
        });
    }

//Aplicando os regex nos campos de CPF e Número de telefone
document.addEventListener('DOMContentLoaded', function () {

    function regexCPF(input) {
        let valor = input.value.replace(/\D/g, '');

        if (valor.length <= 11) {
            valor = valor.replace(/(\d{3})(\d)/, '$1.$2');
            valor = valor.replace(/(\d{3})(\d)/, '$1.$2');
            valor = valor.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
        }

        input.value = valor;
    }



    function regexTelefone(input) {
        let valor = input.value.replace(/\D/g, '');

        if (valor.length <= 11) {
            valor = valor.replace(/(\d{2})(\d)/, '($1) $2');
            valor = valor.replace(/(\d{5})(\d)/, '$1-$2');
        }

        input.value = valor;
    }
    
    // Aplicar as máscaras nos inputs
    document.getElementById('cpfInput').addEventListener('input', function () {
        regexCPF(this);
    });

    document.getElementById('telefoneInput').addEventListener('input', function () {
        regexTelefone(this);
    });
});


document.getElementById("add").addEventListener("click", adicionarPessoa)
carregarPessoas()
searchBar();