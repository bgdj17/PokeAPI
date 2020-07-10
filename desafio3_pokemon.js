const rs = require("readline-sync")
const axios = require("axios")
const fs = require('fs')
var pesquisaPokemon = rs.question("Digite o nome  ou numero do Pokemón > ")
var pokemon = {}

async function pegarHabilidade(data) {
    var pokeHabilidades = data.abilities
    var habilidades = []
    var habilidadesUrl = []
    for (let i = 0; i < pokeHabilidades.length; i++) {
        habilidades.push(pokeHabilidades[i].ability.name)
        habilidadesUrl.push(pokeHabilidades[i].ability.url)
        pokemon.habilidades = habilidades
        axios.get(habilidadesUrl[i])
            .then((resposta) => {
                pokeDescHab = resposta.data.effect_entries[1].effect
                pokemon.descricaoHabilidades = pokeDescHab
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
        danosPorTipo.double_damage_from.forEach(element => {
            if (!doubleDamageFromResult.includes(element)) {
                doubleDamageFromResult.push(element.name)
            }
        })
        danosPorTipo.double_damage_to.forEach(element => {
            if (!doubleDamageToResult.includes(element)) {
                doubleDamageToResult.push(element.name)
            }
        })
        danosPorTipo.half_damage_from.forEach(element => {
            if (!halfDamageFromResult.includes(element)) {
                halfDamageFromResult.push(element.name)
            }
        })
        danosPorTipo.half_damage_to.forEach(element => {
            if (!halfDamageToResult.includes(element)) {
                halfDamageToResult.push(element.name)
            }
        })
        danosPorTipo.no_damage_from.forEach(element => {
            if (!noDamageFromResult.includes(element)) {
                noDamageFromResult.push(element.name)
            }
        })
        danosPorTipo.no_damage_to.forEach(element => {
            if (!noDamageToResult.includes(element)) {
                noDamageToResult.push(element.name)
            }
        })
    }
    pokemon.doubleDamageFrom = doubleDamageFromResult
    pokemon.doubleDamageTo = doubleDamageToResult
    pokemon.halfDamageFrom = halfDamageFromResult
    pokemon.halfDamageTo = halfDamageToResult
    pokemon.noDamageFrom = noDamageFromResult
    pokemon.noDamageTo = noDamageToResult
}
    function mostrarResultadoPokemon() {
        // console.log(JSON.stringify(pokemon,null,2))
        console.log(`NOME: ${pokemon.nome}`)
        console.log('---------------------------------------------------------------')
        console.log(`ID: ${pokemon.id}`)
        console.log('--------------------------------------------------------------')
        console.log(`TIPO: ${pokemon.tipo.join(', ')}`)
        console.log('--------------------------------------------------------------')
        console.log(`HABILIDADES: ${pokemon.habilidades.join(', ')}`)
        console.log('--------------------------------------------------------------')
        console.log(`DOUBLE DAMAGE FROM: ${pokemon.doubleDamageFrom.join(', ')}`)
        console.log('--------------------------------------------------------------')
        console.log(`DOUBLE DAMAGE TO: ${pokemon.doubleDamageTo.join(', ')}`)
        console.log('--------------------------------------------------------------')
        console.log(`HALF DAMAGE FROM: ${pokemon.halfDamageFrom.join(', ')}`)
        console.log('--------------------------------------------------------------')
        console.log(`HALF DAMAGE TO: ${pokemon.halfDamageTo.join(', ')}`)
        console.log('--------------------------------------------------------------')
        console.log(`NO DAMAGE FROM: ${pokemon.noDamageFrom.join(', ')}`)
        console.log('--------------------------------------------------------------')
        console.log(`NO DAMAGE TO: ${pokemon.noDamageTo.join(', ')}`)
        console.log('--------------------------------------------------------------')
        console.log(`DESCRICAO HABILIDADES: ${ pokemon.descricaoHabilidades}`)
        console.log('--------------------------------------------------------------')
    }
    async function main() {
        var resposta = await axios.get(`https://pokeapi.co/api/v2/pokemon/${pesquisaPokemon}`)
        var data = resposta.data
        pokemon.nome = resposta.data.name
        pokemon.id = resposta.data.id
        await pegarHabilidade(data)
        await pegarTipo(data)
        await pegarDanos(pokemon.urlTipo)
        mostrarResultadoPokemon()
        var salvar = rs.keyInYN('Gostaria de salvar as informações desse Pokemon?')
        if (salvar) {
            salvarJson(pokemon)
        }
    }
    main()
    function leJson() {
        var jsonSerializado = fs.readFileSync('pokedex.json');
        var json = JSON.parse(jsonSerializado);
        return json;
    }
    function salvarJson(obj) {
        var jsonLido = leJson()
        if (!jsonLido.find(element => element.id == obj.id)) {
            jsonLido.push(obj)
            var jsonSerializado = JSON.stringify(jsonLido);
            fs.writeFileSync('pokedex.json', jsonSerializado);
        }
    }