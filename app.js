var resultadoPesquisaObj = { nome: '', tipo: '', habilidades: '' }
function dadosParaPesquisa() {
    var pesquisaPokemon = document.getElementById('pesquisaPokemon').value;
    var pokeDescHab = ''
    axios.get(`https://pokeapi.co/api/v2/pokemon/${pesquisaPokemon.toLowerCase()}`)
        .then((resposta) => {
            // nome do Pokemón
            var pokeNome = resposta.data.name
            resultadoPesquisaObj.nome = pokeNome
            var idPokemon =resposta.data.id
            // habilidades do Pokemón
            var pokeHabilidades = resposta.data.abilities
            var habilidades = []
            var habilidadesUrl = []
            var habilidadesUrl = []
            
            // -----
            for (let i = 0; i < pokeHabilidades.length; i++) {
                habilidades.push(pokeHabilidades[i].ability.name)
                habilidadesUrl.push(pokeHabilidades[i].ability.url)
                            
                axios.get(habilidadesUrl[i])
                    .then((resposta) => {
                        pokeDescHab = resposta.data.effect_entries[1].effect
                        mostrarDescricao(pokeDescHab)
                    });
            }

            // Imagem Pokemóm
          document.getElementById("pokemonImg").src=`https://assets.pokemon.com/assets/cms2/img/pokedex/full/${idPokemon}.png`
           
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
                        } console.log(`DOUBLE DAMAGE FROM: ${doubleDamageFromName}`)
                        mostrarDanos(doubleDamageFromName, "danosDF", "DOUBLE DAMAGE FROM:")
                        // -------
                        var doubleDamageTo = resposta.data.damage_relations.double_damage_to
                        for (var i = 0; i < doubleDamageTo.length; i++) {
                            doubleDamageToResult.push(doubleDamageTo[i].name)
                        } console.log(`DOUBLE DAMAGE TO: ${doubleDamageToResult}`)
                        mostrarDanos(doubleDamageToResult, "danosDT", "DOUBLE DAMAGE TO")
                        // ------                
                        var halfDamageFrom = resposta.data.damage_relations.half_damage_from
                        for (var i = 0; i < halfDamageFrom.length; i++) {
                            halfDamageFromResult.push(halfDamageFrom[i].name)
                        } console.log(`HALF DAMAGE FROM:" ${halfDamageFromResult}`)
                        mostrarDanos(halfDamageFromResult, "danosHF", "HALF DAMAGE FROM")

                        // -------
                        var halfDamageTo = resposta.data.damage_relations.half_damage_to
                        for (var i = 0; i < halfDamageTo.length; i++) {
                            halfDamageToResult.push(halfDamageTo[i].name)
                        } console.log(`HALF DAMAGE TO: ${halfDamageToResult}`)
                        mostrarDanos(halfDamageToResult, "danosHT", "HALF DAMAGE TO")

                        // ------
                        var noDamageFrom = resposta.data.damage_relations.no_damage_from
                        for (var i = 0; i < noDamageFrom.length; i++) {
                            noDamageFromResult.push(noDamageFrom[i].name)
                        } console.log(`NO DAMAGE FROM: ${noDamageFromResult}`)
                        mostrarDanos(noDamageFromResult, "NoDanosF", "NO DAMAGE FROM")

                        // ---
                        var noDamageTo = resposta.data.damage_relations.no_damage_to
                        for (var i = 0; i < noDamageTo.length; i++) {
                            noDamageToResult.push(noDamageTo[i].name)
                        } console.log(`NO DAMAGE TO: ${noDamageToResult}`)
                        mostrarDanos(noDamageToResult, "NoDanosT", "NO DAMAGE TO")
                    })
            }
            mostrarNoDoc(pokeNome, tipo, habilidades, pokeDescHab)
            console.log(`NAME: ${pokeNome}, TYPE: ${tipo}, ABILITIES: ${habilidades}`)
        });
}
function mostrarNoDoc(nome, tipo, habilidade) {
    var caminhoNome = document.getElementById("nomePokemon")
    caminhoNome.innerHTML = `<h2>${capitalize(nome)}</h2>`
    var caminhoTipo = document.getElementById("tipo")
    caminhoTipo.innerHTML = `<h5>TIPO: ${tipo}</h5>`
    var caminhoHabilidade = document.getElementById("habilidade")
    caminhoHabilidade.innerHTML = `<h5>HABILIDADE: ${habilidade}</h5>`
}
function mostrarDescricao(descricao) {
    var caminhoDescricao = document.getElementById("descricao")
    caminhoDescricao.innerHTML = `<p>${descricao}</p>`
}
function mostrarDanos(damage, id, texto) {
    var caminhoDanos = document.getElementById(id)
    caminhoDanos.innerHTML = `<h5>${texto}: ${damage}</h5>`
}

function capitalize(texto){
    return texto.charAt(0).toUpperCase() + texto.slice(1)
}