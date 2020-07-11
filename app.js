var pokemon = {};
var pokeImagens = {};
var pokemons = {};
document.addEventListener('DOMContentLoaded', function () {
    axios.get(`https://pokeapi.co/api/v2/pokemon?limit=251`)
        .then((resposta) => {
            pokemons = resposta.data.results;
            var primeiroPoke = pokemons[Math.floor(Math.random() * pokemons.length)];
            pokemons.forEach(poke => {
                var split = poke.url.split('/');
                var num = split[split.length - 2];
                var url = 'http://assets.pokemon.com/assets/cms2/img/pokedex/full/' + num.padStart(3, "0") + ".png";
                pokeImagens[poke.name] = url
            });
            main()
        });
    var elems = document.querySelectorAll('.autocomplete');
    var instances = M.Autocomplete.init(elems, { data: pokeImagens });
})
async function main() {
    var pesquisaPokemon = document.getElementById('pesquisaPokemon').value;
    var response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${pesquisaPokemon}`)
    var data = response.data
    pokemon.nome = data.name
    pokemon.id = data.id
    await pegarHabilidade(data)
    await pegarTipo(data)
    await pegarDanos(pokemon.urlTipo)
    mostrarDadosPokemon(pokemon)
    pegarImagem(pokemon)
   }

async function pegarHabilidade(data) {
    var pokeHabilidades = data.abilities
    var habilidades = []
    var habilidadesUrl = []
    for (let i = 0; i < pokeHabilidades.length; i++) {
        habilidades.push(pokeHabilidades[i].ability.name)
        habilidadesUrl.push(pokeHabilidades[i].ability.url)
        pokemon.habilidades = habilidades
        var respostaApi = await axios.get(habilidadesUrl[i])
        pokeDescHab = respostaApi.data.effect_entries
        pokeDescHab.forEach(element => {
            var descricao = element.effect
            pokemon.descricaoHabilidades = descricao
        });
    }
}
function pegarTipo(data) {
    var pokeTipo = data.types
    var tipo = []
    var urlTipo = []
    pokeTipo.forEach(element => {
        tipo.push(element.type.name)
        urlTipo.push(element.type.url)
    });
    pokemon.tipo = tipo;
    pokemon.urlTipo = urlTipo;
}

async function pegarDanos(listaUrl) {
    var tipoUrl = []
    var resposta = []
    var respostaDanos = []
    var doubleDamageFromResult = [];
    var doubleDamageToResult = [];
    var halfDamageFromResult = [];
    var halfDamageToResult = [];
    var noDamageFromResult = [];
    var noDamageToResult = [];
    var respostaData = []
    listaUrl.forEach(element => {
        tipoUrl.push(axios.get(element))
    });
    await Promise.all(tipoUrl).then((responses) => {
        resposta = responses
        resposta.forEach(element => {
            respostaData.push(element.data)
        });
    });
    respostaData.forEach(element => {
        respostaDanos.push(element)
    });
    danosPorTipo = 0
    for (let i = 0; i < pokemon.tipo.length; i++) {
        danosPorTipo = respostaDanos[i].damage_relations
        function pegarDano(dano, resultado) {
            dano.forEach(element => {
                if (!resultado.includes(element)) {
                    resultado.push(element.name)
                }
            })
        }
        pegarDano(danosPorTipo.double_damage_from, doubleDamageFromResult)
        pegarDano(danosPorTipo.double_damage_to, doubleDamageToResult)
        pegarDano(danosPorTipo.half_damage_from, halfDamageFromResult)
        pegarDano(danosPorTipo.half_damage_to, halfDamageToResult)
        pegarDano(danosPorTipo.no_damage_from, noDamageFromResult)
        pegarDano(danosPorTipo.no_damage_to, noDamageToResult)
    }
    pokemon.doubleDamageFrom = doubleDamageFromResult.join(', ')
    pokemon.doubleDamageTo = doubleDamageToResult.join(', ')
    pokemon.halfDamageFrom = halfDamageFromResult.join(', ')
    pokemon.halfDamageTo = halfDamageToResult.join(', ')
    pokemon.noDamageFrom = noDamageFromResult.join(', ')
    pokemon.noDamageTo = noDamageToResult.join(',')
}
function mostrarDadosPokemon(pokemon) {
    var caminhoNome = document.getElementById("nomePokemon")
    caminhoNome.innerHTML = `<h4>${capitalize(pokemon.nome)}</h4>`
    mostrarDado(pokemon.tipo.join(', '), 'tipo')
    mostrarDado(pokemon.habilidades.join(', '), 'habilidade')
    mostrarDado(pokemon.descricaoHabilidades, 'descricao')
    mostrarDado(pokemon.id, 'pokeId')
    mostrarDado(pokemon.doubleDamageFrom, 'danosDF')
    mostrarDado(pokemon.doubleDamageTo, 'danosDT')
    mostrarDado(pokemon.halfDamageFrom, 'danosHF')
    mostrarDado(pokemon.halfDamageTo, 'danosHT')
    mostrarDado(pokemon.noDamageFrom, 'noDanosF')
    mostrarDado(pokemon.noDamageTo, 'noDanosT')
}
function mostrarDado(valorParaExibicao, id) {
    var caminho = document.getElementById(id);
    caminho.innerHTML = valorParaExibicao;
}
async function pegarImagem(pokemon) {
    var num = pokemon.id.toString()
    var imagem = await `https://assets.pokemon.com/assets/cms2/img/pokedex/full/${num.padStart(3, 0)}.png`
    document.getElementById("pokemonImg").src = imagem
}
function capitalize(texto) {
    return texto.charAt(0).toUpperCase() + texto.slice(1);
}
function startModal() {
    var elems = document.querySelectorAll('.autocomplete');
    var instances = M.Autocomplete.init(elems, { data: pokeImagens });
}
var input = document.getElementById("pesquisaPokemon");
input.addEventListener("keydown", function (event) {
    if (event.keyCode === 13) {
        document.getElementById("btnPesquisaPokemon").click();
    }
})
function resetInput() {
    var pesquisaPokemon = document.getElementById('pesquisaPokemon');
    pesquisaPokemon.value = "";
}


