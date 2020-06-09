var resultadoPesquisaObj = { nome: '', tipo: '', habilidades: '' }
function dadosParaPesquisa() {
    var pesquisaPokemon = document.getElementById('pesquisaPokemon').value;
    var habilidades = []
    var pokeHabilidades = []
    var pokeDescHab = ''
    axios.get(`https://pokeapi.co/api/v2/pokemon/${pesquisaPokemon}`)
        .then((resposta) => {
            // nome do Pokemón
            var pokeNome = resposta.data.name
            resultadoPesquisaObj.nome = pokeNome
           
            // habilidades do Pokemón
            var pokeHabilidades = resposta.data.abilities
            var habilidades = []
            var habilidadesUrl = []
            

            var habilidadesUrl = []
            // var pokeDescHab = ''

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
            //  tipo
        var pokeTipo = resposta.data.types
        var tipo = []
        var tipoUrl =""
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
            .then((resposta)=>{
                // --------
                var doubleDamageFrom = resposta.data.damage_relations.double_damage_from
                for(var i = 0 ; i< doubleDamageFrom.length; i++){
                    doubleDamageFromName.push(doubleDamageFrom[i].name)                
                } console.log(`DOUBLE DAMAGE FROM: ${doubleDamageFromName}`)
               
                // -------
                var doubleDamageTo = resposta.data.damage_relations.double_damage_to
                for(var i = 0; i< doubleDamageTo.length; i++){
                    doubleDamageToResult.push(doubleDamageTo[i].name)
                }console.log(`DOUBLE DAMAGE TO: ${doubleDamageToResult}`)
                
                // ------                
                var halfDamageFrom = resposta.data.damage_relations.half_damage_from
                for(var i = 0; i< halfDamageFrom.length; i++ ){
                    halfDamageFromResult.push(halfDamageFrom[i].name)
                }console.log(`HALF DAMAGE FROM:" ${halfDamageFromResult}`)
                
                // -------
                var halfDamageTo = resposta.data.damage_relations.half_damage_to
                for(var i = 0; i< halfDamageTo.length; i++ ){
                    halfDamageToResult.push(halfDamageTo[i].name)
                }console.log(`HALF DAMAGE TO: ${halfDamageToResult}`)
                
                // ------
                var noDamageFrom = resposta.data.damage_relations.no_damage_from
                for(var i = 0; i< noDamageFrom.length; i++ ){
                    noDamageFromResult.push(noDamageFrom[i].name)
                }console.log(`NO DAMAGE FROM: ${noDamageFromResult}`)
                
                // ---
                var noDamageTo = resposta.data.damage_relations.no_damage_to
                for(var i = 0; i< noDamageTo.length; i++ ){
                    noDamageToResult.push(noDamageTo[i].name)
                }console.log(`NO DAMAGE TO: ${noDamageToResult}`)
                
            })
        }
        mostrarNoDoc(pokeNome, tipo, habilidades, pokeDescHab)
        console.log(`NAME: ${pokeNome}, TYPE: ${tipo}, ABILITIES: ${habilidades}`)
               
    });
}

function mostrarNoDoc(nome, tipo, habilidade){
var caminhoNome = document.getElementById("nomePokemon")
caminhoNome.innerHTML =`<h3>${nome}</h3>`
var caminhoTipo = document.getElementById("tipo")
caminhoTipo.innerHTML =`<h6>TIPO: ${tipo}</h6>`
var caminhoHabilidade = document.getElementById("habilidade")
caminhoHabilidade.innerHTML =`<h6>HABILIDADE: ${habilidade}</h6>`
}
function mostrarDescricao(descricao){
    var caminhoDescricao = document.getElementById("descricao")
caminhoDescricao.innerHTML = `<p>${descricao}</p>`
}
function mostrarDanos(doubleDamageFromName){
    var caminhoDanos = document.getElementById("danos")
caminhoDanos.innerHTML =`<h6>HABILIDADE: ${danos}</h6>`
}