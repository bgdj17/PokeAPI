var resultadoPesquisaObj = { nome: '', id: '', tipo: '', habilidades: '', descricao: '' }
// Autocomplete
var pokeImagens = {}
var pokemons ={}
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
            dadosParaPesquisa()
        });
    var elems = document.querySelectorAll('.autocomplete');
    var instances = M.Autocomplete.init(elems, { data: pokeImagens });
})
// 
function dadosParaPesquisa() {
    var pesquisaPokemon = document.getElementById('pesquisaPokemon').value;
    if(pesquisaPokemon >807){
        alert('Digite um número entre 1 a 807.')
    }
    var pokeDescHab = ''
    var idPokemon = ''
    
    // Autocomplete
    axios.get(`https://pokeapi.co/api/v2/pokemon/${pesquisaPokemon.toLowerCase()}`)
        .then((resposta) => {
            // nome e ID do Pokemón
            var pokeNome = resposta.data.name
            resultadoPesquisaObj.nome = pokeNome
            idPokemon = resposta.data.id
            resultadoPesquisaObj.id = idPokemon
            var numId = ""
            num = idPokemon.toString()
            
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
            document.getElementById("pokemonImg").src = `https://assets.pokemon.com/assets/cms2/img/pokedex/full/${num.padStart(3, 0)}.png`

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
                            }
                        var doubleDamageFromNameJoin = doubleDamageFromName.join(', ')
                        mostrarDanos(doubleDamageFromNameJoin, "danosDF")
                        
                        // -------
                        var doubleDamageTo = resposta.data.damage_relations.double_damage_to
                        for (var i = 0; i < doubleDamageTo.length; i++) {
                            doubleDamageToResult.push(doubleDamageTo[i].name)
                        } 
                        var doubleDamageToResultJoin = doubleDamageToResult.join(', ')
                        mostrarDanos(doubleDamageToResultJoin, "danosDT")
                        
                        // ------                
                        var halfDamageFrom = resposta.data.damage_relations.half_damage_from
                        for (var i = 0; i < halfDamageFrom.length; i++) {
                            halfDamageFromResult.push(halfDamageFrom[i].name)
                        } 
                        var halfDamageFromResultJoin = halfDamageFromResult.join(', ')
                        mostrarDanos(halfDamageFromResultJoin, "danosHF")

                        // -------
                        var halfDamageTo = resposta.data.damage_relations.half_damage_to
                        for (var i = 0; i < halfDamageTo.length; i++) {
                            halfDamageToResult.push(halfDamageTo[i].name)
                        }
                        var halfDamageToResultJoin = halfDamageToResult.join(', ')
                        mostrarDanos(halfDamageToResultJoin, "danosHT")
                        // ------
                        var noDamageFrom = resposta.data.damage_relations.no_damage_from
                        for (var i = 0; i < noDamageFrom.length; i++) {
                            noDamageFromResult.push(noDamageFrom[i].name)
                        }
                        var noDamageFromResultJoin = noDamageFromResult.join(', ')
                        mostrarDanos(noDamageFromResultJoin, "noDanosF")

                        // ---
                        var noDamageTo = resposta.data.damage_relations.no_damage_to
                        for (var i = 0; i < noDamageTo.length; i++) {
                            noDamageToResult.push(noDamageTo[i].name)
                        }
                        var noDamageToResultJoin = noDamageToResult.join(', ')
                        mostrarDanos(noDamageToResultJoin, "noDanosT")
                    })
            }
            resultadoPesquisaObj.tipo = tipo
            mostrarNoDoc(pokeNome, tipo, habilidades, resultadoPesquisaObj.id)
            resetInput()
        });
}
function mostrarNoDoc(nome, tipo, habilidade, id) {
    var caminhoNome = document.getElementById("nomePokemon")
    caminhoNome.innerHTML = `<h4>${capitalize(nome)}</h4>`
    var caminhoTipo = document.getElementById("tipo")
    caminhoTipo.innerHTML = `${tipo}`
    var caminhoHabilidade = document.getElementById("habilidade")
    caminhoHabilidade.innerHTML = `${habilidade}`
    var caminhoIdPoke = document.getElementById("pokeId")
    caminhoIdPoke.innerHTML = id
}
function mostrarDescricao(descricao) {
    var caminhoDescricao = document.getElementById("descricao")
    caminhoDescricao.innerHTML = `<p>${descricao}</p>`
}
function mostrarDanos(damage, id) {
    var caminhoDanos = document.getElementById(id)
    caminhoDanos.innerHTML = `${damage}`
}
function capitalize(texto) {
    return texto.charAt(0).toUpperCase() + texto.slice(1)
}
function startModal() {
    var elems = document.querySelectorAll('.autocomplete');
    var instances = M.Autocomplete.init(elems, { data: pokeImagens });

}
var input = document.getElementById("pesquisaPokemon");
input.addEventListener("keydown", function (event) {
    if (event.keyCode === 13) {
        document.getElementById("btnPesquisaPokemon").click()
    }
})
document.addEventListener('DOMContentLoaded', function() {
    var elems = document.querySelectorAll('.materialboxed');
    var instances = M.Materialbox.init(elems, outDuration);
  });
  function resetInput(){
    var pesquisaPokemon = document.getElementById('pesquisaPokemon')
    pesquisaPokemon.value = ""
  }
  

