var resultadoPesquisaObj = { nome: '',id:'', tipo: '', habilidades: '', descricao: ''}

function dadosParaPesquisa() {
    var pesquisaPokemon = document.getElementById('pesquisaPokemon').value;
    var pokeDescHab = ''
    var idPokemon = ''
    axios.get(`https://pokeapi.co/api/v2/pokemon/${pesquisaPokemon.toLowerCase()}`)
        .then((resposta) => {
            // nome e ID do Pokemón
            var pokeNome = resposta.data.name
            resultadoPesquisaObj.nome = pokeNome
            idPokemon = resposta.data.id
            resultadoPesquisaObj.id = idPokemon
            var numId = ""
            num =idPokemon.toString()
            console.log(num.padStart(3,0))
         
            // habilidades do Pokemón
            var pokeHabilidades = resposta.data.abilities
            var habilidades = []
            var habilidadesUrl = []
            var descricaoDasHabilidades = []
            for (let i = 0; i < pokeHabilidades.length; i++) {
                habilidades.push(pokeHabilidades[i].ability.name)
                habilidadesUrl.push(pokeHabilidades[i].ability.url)
                // Nova requisição para pegar a descrição da habilidade
                resultadoPesquisaObj.habilidades = habilidades
                axios.get(habilidadesUrl[i])
                    .then((resposta) => {
                        pokeDescHab = resposta.data.effect_entries[1].effect
                        mostrarDescricao(pokeDescHab)
                        resultadoPesquisaObj.descricao = pokeDescHab
                    });
            }
            
            // Imagem Pokemóm
            document.getElementById("pokemonImg").src = `https://assets.pokemon.com/assets/cms2/img/pokedex/full/${num.padStart(3,0)}.png`

            //  tipo
            var pokeTipo = resposta.data.types
            var tipo = []
            var tipoUrl = ""
            var doubleDamageFromName = []
            var doubleDamageToResult = []
            var halfDamageFromResult = []
            var halfDamageToResult = []
            var noDamageFromResult = []
            var noDamageToResult = []
            for (var i = 0; i < pokeTipo.length; i++) {
                tipo.push(pokeTipo[i].type.name)
                tipoUrl = pokeTipo[i].type.url

                axios.get(tipoUrl)
                    .then((resposta) => {
                        // --------
                        var doubleDamageFrom = resposta.data.damage_relations.double_damage_from
                        for (var i = 0; i < doubleDamageFrom.length; i++) {
                            doubleDamageFromName.push(doubleDamageFrom[i].name)
                            console.log(`Para o tipo: ${tipo[i]} DOUBLE DAMAGE FROM: ${doubleDamageFromName}`)
                        } 
                        var doubleDamageFromNameJoin= doubleDamageFromName.join(', ')
                        mostrarDanos(doubleDamageFromNameJoin, "danosDF", "Double Damage From")
                        // -------
                        var doubleDamageTo = resposta.data.damage_relations.double_damage_to
                        for (var i = 0; i < doubleDamageTo.length; i++) {
                            doubleDamageToResult.push(doubleDamageTo[i].name)                          
                        } console.log(`DOUBLE DAMAGE TO: ${doubleDamageToResult}`)
                        var doubleDamageToResultJoin = doubleDamageToResult.join(', ')
                        mostrarDanos(doubleDamageToResultJoin, "danosDT", "Double Damage To")
                        // ------                
                        var halfDamageFrom = resposta.data.damage_relations.half_damage_from
                        for (var i = 0; i < halfDamageFrom.length; i++) {
                            halfDamageFromResult.push(halfDamageFrom[i].name)
                        } console.log(`HALF DAMAGE FROM:" ${halfDamageFromResult}`)
                        var halfDamageFromResultJoin = halfDamageFromResult.join(', ') 
                        mostrarDanos(halfDamageFromResultJoin, "danosHF", "Half Damage From")

                        // -------
                        var halfDamageTo = resposta.data.damage_relations.half_damage_to
                        for (var i = 0; i < halfDamageTo.length; i++) {
                            halfDamageToResult.push(halfDamageTo[i].name)
                        } console.log(`HALF DAMAGE TO: ${halfDamageToResult}`)
                        var halfDamageToResultJoin = halfDamageToResult.join(', ')
                        mostrarDanos(halfDamageToResultJoin, "danosHT", "Half Damage To")
                        // ------
                        var noDamageFrom = resposta.data.damage_relations.no_damage_from
                        for (var i = 0; i < noDamageFrom.length; i++) {
                            noDamageFromResult.push(noDamageFrom[i].name)
                        } console.log(`NO DAMAGE FROM: ${noDamageFromResult}`)
                        var noDamageFromResultJoin = noDamageFromResult.join(', ')
                        mostrarDanos(noDamageFromResultJoin, "noDanosF", "No Damage From")

                        // ---
                        var noDamageTo = resposta.data.damage_relations.no_damage_to
                        for (var i = 0; i < noDamageTo.length; i++) {
                            noDamageToResult.push(noDamageTo[i].name)
                        } console.log(`NO DAMAGE TO: ${noDamageToResult}`)
                        var noDamageToResultJoin= noDamageToResult.join(', ')
                        mostrarDanos(noDamageToResult, "noDanosT", "NO DAMAGE TO")
                    })
            }
            resultadoPesquisaObj.tipo = tipo
            console.log(idPokemon)
            mostrarNoDoc(pokeNome, tipo, habilidades, resultadoPesquisaObj.id)
            console.log(`NAME: ${pokeNome}, TYPE: ${tipo}, ABILITIES: ${habilidades}`)
        });
}
function mostrarNoDoc(nome, tipo, habilidade, id) {
    var caminhoNome = document.getElementById("nomePokemon")
    caminhoNome.innerHTML = `<h3>${capitalize(nome)}</h3>`
    var caminhoTipo = document.getElementById("tipo")
    caminhoTipo.innerHTML = `TIPO: ${tipo}`
    var caminhoHabilidade = document.getElementById("habilidade")
    caminhoHabilidade.innerHTML = `HABILIDADE: ${habilidade}`
    var caminhoIdPoke = document.getElementById("pokeId")
    caminhoIdPoke.innerHTML = id
}
function mostrarDescricao(descricao) {
    var caminhoDescricao = document.getElementById("descricao")
    caminhoDescricao.innerHTML = `<p>${descricao}</p>`
}
function mostrarDanos(damage, id, texto) {
    var caminhoDanos = document.getElementById(id)
    caminhoDanos.innerHTML = `${texto.toUpperCase()}: ${damage}`
}
function capitalize(texto) {
    return texto.charAt(0).toUpperCase() + texto.slice(1)
}
var input = document.getElementById("pesquisaPokemon");
    input.addEventListener("keydown", function (event) {
        if (event.keyCode === 13) {
            document.getElementById("btnPesquisaPokemon").click()
        }
    })