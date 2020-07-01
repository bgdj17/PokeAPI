const rs = require("readline-sync")
const axios = require("axios")
const fs = require('fs')
var pesquisaPokemon = rs.question("Digite o nome  ou numero do Pokemón > ")
var pokemon = {}

async function pegarHabilidade(data) {
    var pokeHabilidades = data.abilities
    var habilidades = []
    var habilidadesUrl = []
    var pokeDescHab = ''
    for (let i = 0; i < pokeHabilidades.length; i++) {
        habilidades.push(pokeHabilidades[i].ability.name)
        habilidadesUrl.push(pokeHabilidades[i].ability.url)
        pokemon.habilidades = habilidades
        var resposta = await axios.get(habilidadesUrl[i])
        pokeDescHab = resposta.data.effect_entries
        if (pokeDescHab[0].language.name == 'en') {
            pokemon.descricaoHabilidades = pokeDescHab[0].effect
        }
        else {
            pokemon.descricaoHabilidades = pokeDescHab[1].effect
        }
    }
}
async function pegarTipoEDano(data) {
    var pokeTipo = data.types
    var tipo = []
    var tipoUrl = []
    var doubleDamageFromName = []
    var doubleDamageToResult = []
    var halfDamageFromResult = []
    var halfDamageToResult = []
    var noDamageFromResult = []
    var noDamageToResult = []
    for (var i = 0; i < pokeTipo.length; i++) {
        tipo.push(pokeTipo[i].type.name)
        pokemon.tipo = tipo
        tipoUrl.push(pokeTipo[i].type.url)
        var resposta = await axios.get(tipoUrl[i])
        var doubleDamageFrom = resposta.data.damage_relations.double_damage_from
        doubleDamageFrom.forEach(element => doubleDamageFromName.push(element.name));
        pokemon.doubleDamageFrom = doubleDamageFromName
        // -------
        var doubleDamageTo = resposta.data.damage_relations.double_damage_to
        doubleDamageTo.forEach(element => doubleDamageToResult.push(element.name));
        pokemon.doubleDamageTo = doubleDamageToResult
        // ------                
        var halfDamageFrom = resposta.data.damage_relations.half_damage_from
        halfDamageFrom.forEach(element => halfDamageFromResult.push(element.name));
        pokemon.halfDamageFrom = halfDamageFromResult
        // -------
        var halfDamageTo = resposta.data.damage_relations.half_damage_to
        halfDamageTo.forEach(element => halfDamageToResult.push(element.name));
        pokemon.halfDamageTo = halfDamageToResult
        // ------
        var noDamageFrom = resposta.data.damage_relations.no_damage_from
        noDamageFrom.forEach(element => noDamageFromResult.push(element.name));
        pokemon.noDamageFrom = noDamageFromResult
        // ---
        var noDamageTo = resposta.data.damage_relations.no_damage_to
        noDamageTo.forEach(element => noDamageToResult.push(element.name));
        pokemon.noDamageTo = noDamageToResult;
    }
}

function mostrarResultadoPokemon() {
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
// function salvarJson(obj) {
//     var objSerializado = JSON.stringify(obj)
//     var caminhoArquivo = './pokemon.json'
//     fs.appendFileSync(caminhoArquivo, objSerializado, err => {
//         console.log(err)
//     })
// }
async function main() {
    var resposta = await axios.get(`https://pokeapi.co/api/v2/pokemon/${pesquisaPokemon}`)
    var data = resposta.data
    pokemon.nome = resposta.data.name
    pokemon.id = resposta.data.id
    await pegarHabilidade(data)
    await pegarTipoEDano(data)
    mostrarResultadoPokemon()
    opcao = rs.keyInYN('Gostaria de salvar as informações desse Pokemon?')
    if (opcao) {
      salvarJson(pokemon)
    }
}
main()

function leJson() {
    var jsonSerializado = fs.readFileSync('pokedex.json');
    var json = JSON.parse(jsonSerializado);
    return json;
}
function salvarJson(obj){
    var jsonLido = leJson()
    if(!jsonLido.find(element => element.id == obj.id)){
        jsonLido.push(obj)
    var jsonSerializado = JSON.stringify(jsonLido);
    fs.writeFileSync('pokedex.json', jsonSerializado);
    }
}