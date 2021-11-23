let link = "https://mock-api.driven.com.br/api/v4/buzzquizz/quizzes"
const PromessaTodosQuizzes = axios.get(link);
PromessaTodosQuizzes.then(TratarSucesso);

let ListaDeQuizzes; // lista com os quizzes

function TratarSucesso(resposta) {
    ColocarTodosQuizzes(resposta.data);
    ListaDeQuizzes = resposta.data;
}

// COLOCA A GALERA NA TELA E DEFINE OS IDs DE ENTRADA PARA O ONCLICK
function ColocarTodosQuizzes(Objetopai){
    const ComprimentoObjetosQuizzees = Object.keys(Objetopai).length;
    //acima tem o LENGTH do Objeto com o NUMERO TOTAL DE QUIZZES!!!

    const BlocodeQuizzes = document.querySelector(".caixa-de-quizzes");
    for(let i=0; i<ComprimentoObjetosQuizzees; i++){
        
        BlocodeQuizzes.innerHTML += `
        <div class="bloco-cada-quizz" style =" background: linear-gradient(180deg, rgba(255, 255, 255, 0) 0%, rgba(0, 0, 0, 0.5) 64.58%, #000000 100%), url(${Objetopai[i].image})" onclick="abrirQuizz(${Objetopai[i].id})" data-identifier="quizz-card">
       
        <div class="titulo-cada-quizz">${Objetopai[i].title}</div>
        </div>`
    }
}

//embaralhando lista de opçoes de cada Pergunta
function embaralhador() { 
	return Math.random() - 0.5; 
}

function abrirCriacao(){
    const tela1 = document.querySelector(" .desktop-1");
    tela1.classList.add("invisivel");
    const telaCriacao = document.querySelector(" .Desktop-8");
    telaCriacao.classList.remove("invisivel");
}

let identificador;
// RODAR QUIZZ
function abrirQuizz(id){
    let linkQuizz = "https://mock-api.driven.com.br/api/v4/buzzquizz/quizzes/"+id;
    const quizzSelecionado = axios.get(linkQuizz);
    quizzSelecionado.then(colocarQuizzTela);
    identificador=id;
}

function colocarQuizzTela(objeto){
    window.scrollTo({ top: 100, left: 100, behavior: 'smooth' });
    const tela1 = document.querySelector(" .desktop-1");
    tela1.classList.add("invisivel");
    const telaQuizz = document.querySelector(" .quizz");
    telaQuizz.classList.remove("invisivel");


    let dadosQuizz = objeto.data;
    let questoes = dadosQuizz.questions;
    
    niveis = dadosQuizz.levels; // salvando niveis do quizz aberto
    

    // colocando na tela
    telaQuizz.innerHTML = `
    <div class="titulo-quizz" style="background: linear-gradient(0deg, rgba(0, 0, 0, 0.57), rgba(0, 0, 0, 0.57)), 
    url(${dadosQuizz.image}) no-repeat; background-size: cover">
            <h1 class="titulo-texto-quizz">${dadosQuizz.title}</h1>
    </div>`
    
    const fundoQuizz = document.querySelector(` .titulo-quizz`);
    
    for (let i = 0; i < questoes.length; i++){
        let perguntas = dadosQuizz.questions[i];
        let opcoes = perguntas.answers;
        opcoes.sort(embaralhador);
        

        totalPerguntas++;
        telaQuizz.innerHTML += 
                `
                <div class="pergunta-container pergunta${i}">
                <div class="pergunta-titulo" style="background-color: ${perguntas.color}">${dadosQuizz.questions[i].title}</div>
                </div>
                `
                
        for (let j = 0; j  < opcoes.length; j++) {
            const caixaPergunta= document.querySelectorAll(" .pergunta-container").item(i);
            caixaPergunta.innerHTML +=    
            `
            <div class="opcao-pergunta ${opcoes[j].isCorrectAnswer}" onclick="selecionarOpcao(this)">
                <img src="${opcoes[j].image}" alt="">
                <h2>${opcoes[j].text}</h2>
            </div>
            `
        }              
    }
}


//JOGANDO QUIZZ
let perguntasClicadas=0;
let totalPerguntas=0;

function selecionarOpcao(opcaoClicada){
    let blocoPergunta = opcaoClicada.parentNode;
    const respostas = blocoPergunta.querySelectorAll('.opcao-pergunta');

    perguntasClicadas++
    
    for(let i = 0; i < respostas.length; i++){
        if(respostas[i] !== opcaoClicada){
            respostas[i].classList.add("opcao-cinza");
        }
        if(respostas[i].classList.contains("true")){
            respostas[i].classList.add("opcao-certa");
        }
        else{
            respostas[i].classList.add("opcao-errada");
        }
        respostas[i].removeAttribute('onclick');
    }

    if(opcaoClicada.classList.contains("true")){
        perguntasCertas++
    }
    
    if(totalPerguntas===perguntasClicadas){
        postarResultado()
    }
}

let porcentagemAcerto=0;
let perguntasCertas=0;
let niveis;
function postarResultado(){
    porcentagemAcerto = ((perguntasCertas/totalPerguntas)*100);
    let porcentagemFinal =  porcentagemAcerto.toFixed(0);
    let indiceLevel;

    const telaQuizz = document.querySelector(" .quizz");
    
    for (let i = 0; i< niveis.length; i++ ){
        if(porcentagemFinal >= niveis[i].minValue){
            indiceLevel=i
        }
    }
    
    telaQuizz.innerHTML+= 
    `
    <div class="resultado-quizz">
        <div class="resultado-titulo">${porcentagemFinal}% de acerto: ${niveis[indiceLevel].title}</div>
    
        <div class="resultado-div">
            <img src="${niveis[indiceLevel].image}" alt="">
            <h2>${niveis[indiceLevel].text}</h2>
        </div>
    </div>

    <div class="botao-reiniciar" onclick="reiniciarQuizz()">Reiniciar Quizz</div>
    <div class = "voltar-home" onclick="VoltarHome()"> Voltar para a home </div>
    `

}


function reiniciarQuizz(){
    abrirQuizz(identificador);
}

