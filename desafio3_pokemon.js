const rs = require("readline-sync")
const axios = require("axios")
const fs = require('fs')
var pesquisaPokemon = rs.question("Digite o nome  ou numero do Pokemón > ")
var pokemon = {}
async function pegarHabilidade(data) {
    var pokeHabilidades = data.abilities;
    var habilidades = [];
    var habilidadesUrl = [];
    pokeHabilidades.forEach(element => {
        habilidades.push(element.ability.name)
        pokemon.habilidades = habilidades
        habilidadesUrl.push(axios.get(element.ability.url))
        pokemon.habilidadesUrl = habilidadesUrl
    });
    await pegarDescricaoHabilidade(pokemon.habilidadesUrl)
}
async function pegarDescricaoHabilidade(habilidadesUrl) {
    await Promise.all(habilidadesUrl).then(responses => {
        responses.forEach(response => {
            const resposta = response.data.effect_entries;
            if (resposta[0].language.name == 'en') pokemon.descricaoHabilidades = resposta[0].effect
            else pokemon.descricaoHabilidades = resposta[1].effect
        })
    })
}
async function pegarTipo(data) {
    var pokeTipo = data.types
    var tipo = []
    var tipoUrl = []
    pokeTipo.forEach(element => {
        tipo.push(element.type.name)
        tipoUrl.push(axios.get(element.type.url))
        pokemon.tipo = tipo
    });
    await pegarDanos(tipoUrl)
}
async function pegarDanos(tipoUrl) {
    await Promise.all(tipoUrl).then(responses => {
        responses.forEach(response => {
            const respostaDanos = response.data.damage_relations;
            var doubleDamageFromResult = []
            var doubleDamageToResult = []
            var halfDamageFromResult = []
            var halfDamageToResult = []
            var noDamageFromResult = []
            var noDamageToResult = []
            respostaDanos.double_damage_from.forEach(element => doubleDamageFromResult.push(element.name));
            pokemon.doubleDamageFrom = doubleDamageFromResult
            // // -------
            respostaDanos.double_damage_to.forEach(element => doubleDamageToResult.push(element.name));
            pokemon.doubleDamageTo = doubleDamageToResult
            // // ------                
            respostaDanos.half_damage_from.forEach(element => halfDamageFromResult.push(element.name));
            pokemon.halfDamageFrom = halfDamageFromResult
            // // -------
            respostaDanos.half_damage_to.forEach(element => halfDamageToResult.push(element.name));
            pokemon.halfDamageTo = halfDamageToResult
            // // ------
            respostaDanos.no_damage_from.forEach(element => noDamageFromResult.push(element.name));
            pokemon.noDamageFrom = noDamageFromResult
            // // ---
            respostaDanos.no_damage_to.forEach(element => noDamageToResult.push(element.name));
            pokemon.noDamageTo = noDamageToResult;
        })
    })
}
function mostrarResultadoPokemon() {
    // console.log(JSON.stringify(pokemon,null,2))
    console.log(`NOME: ${pokemon.nome}`)
    console.log('------------------------------')
    console.log(`ID: ${pokemon.id}`)
    console.log('-----------------------------')
    console.log(`TIPO: ${pokemon.tipo}`)
    console.log('-----------------------------')
    console.log(`HABILIDADES: ${pokemon.habilidades}`)
    console.log('-----------------------------')
    console.log(`DOUBLE DAMAGE FROM: ${pokemon.doubleDamageFrom}`)
    console.log('-----------------------------')
    console.log(`DOUBLE DAMAGE TO: ${pokemon.doubleDamageTo}`)
    console.log('-----------------------------')
    console.log(`HALF DAMAGE FROM: ${pokemon.halfDamageFrom}`)
    console.log('-----------------------------')
    console.log(`HALF DAMAGE TO: ${pokemon.halfDamageTo}`)
    console.log('-----------------------------')
    console.log(`NO DAMAGE FROM: ${pokemon.noDamageFrom}`)
    console.log('-----------------------------')
    console.log(`NO DAMAGE TO: ${pokemon.noDamageTo}`)
    console.log('-----------------------------')
    console.log(`DESCRICAO HABILIDADES: ${pokemon.descricaoHabilidades}`)
    console.log('-----------------------------')
}
async function main() {
    var resposta = await axios.get(`https://pokeapi.co/api/v2/pokemon/${pesquisaPokemon}`)
    var data = resposta.data
    pokemon.nome = resposta.data.name
    pokemon.id = resposta.data.id
    await pegarHabilidade(data)
    await pegarTipo(data)
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