var pokemon = {};
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
// Inicio Função Principal
function dadosParaPesquisa() {
    var pesquisaPokemon = document.getElementById('pesquisaPokemon').value;
    if(pesquisaPokemon >807){
        alert('Digite um número entre 1 a 807.')
    }
    var pokeDescHab = ''
    var idPokemon = ''
    axios.get(`https://pokeapi.co/api/v2/pokemon/${pesquisaPokemon.toLowerCase()}`)
        .then((resposta) => {
            // nome e ID do Pokemón
            var pokeNome = resposta.data.name
            pokemon.nome = pokeNome
            idPokemon = resposta.data.id
            pokemon.id = idPokemon
            var numId = ""
            num = idPokemon.toString()
            
            // habilidades do Pokemón
            var pokeHabilidades = resposta.data.abilities
            var habilidades = []
            var habilidadesUrl = []
            for (let i = 0; i < pokeHabilidades.length; i++) {
                habilidades.push(pokeHabilidades[i].ability.name)
                habilidadesUrl.push(pokeHabilidades[i].ability.url)
                // Nova requisição para pegar a descrição da habilidade
                pokemon.habilidades = habilidades
                axios.get(habilidadesUrl[i])
                    .then((resposta) => {
                        pokeDescHab = resposta.data.effect_entries[1].effect
                        mostrarDescricao(pokeDescHab)
                        pokemon.descricao = pokeDescHab
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

            pokeTipo.forEach(element => {
                tipo.push(element.type.name)
                tipoUrl = element.type.url

                axios.get(tipoUrl)
                    .then((resposta) => {
                        // --------
                        var doubleDamageFrom = resposta.data.damage_relations.double_damage_from;
                        doubleDamageFrom.forEach(element => doubleDamageFromName.push(element.name));
                        var doubleDamageFromNameJoin = doubleDamageFromName.join(', ');
                        mostrarDanos(doubleDamageFromNameJoin, "danosDF");
                        pokemon.doubleDamageFrom = doubleDamageFromNameJoin;
                        
                        // -------
                        var doubleDamageTo = resposta.data.damage_relations.double_damage_to;
                        doubleDamageTo.forEach(element => doubleDamageToResult.push(element.name));
                        var doubleDamageToResultJoin = doubleDamageToResult.join(', ');
                        mostrarDanos(doubleDamageToResultJoin, "danosDT");
                        pokemon.doubleDamageTo =doubleDamageToResultJoin;
                        // ------                
                        var halfDamageFrom = resposta.data.damage_relations.half_damage_from;
                        halfDamageFrom.forEach(element => halfDamageFromResult.push(element.name));
                        var halfDamageFromResultJoin = halfDamageFromResult.join(', ');
                        mostrarDanos(halfDamageFromResultJoin, "danosHF");

                        // -------
                        var halfDamageTo = resposta.data.damage_relations.half_damage_to;
                        halfDamageTo.forEach(element => halfDamageToResult.push(element.name));
                        var halfDamageToResultJoin = halfDamageToResult.join(', ')
                        mostrarDanos(halfDamageToResultJoin, "danosHT")
                        // ------
                        var noDamageFrom = resposta.data.damage_relations.no_damage_from;
                        noDamageFrom.forEach(element => noDamageFromResult.push(element.name));
                        var noDamageFromResultJoin = noDamageFromResult.join(', ');
                        mostrarDanos(noDamageFromResultJoin, "noDanosF");

                        // ---
                        var noDamageTo = resposta.data.damage_relations.no_damage_to;
                        noDamageTo.forEach(element =>  noDamageToResult.push(element.name));
                        var noDamageToResultJoin = noDamageToResult.join(', ');
                        mostrarDanos(noDamageToResultJoin, "noDanosT");
                    })
                });
            pokemon.tipo = tipo
         exibirNaPaginaHtml(pokeNome, tipo, habilidades, pokemon.id)
            resetInput()
        })
        .catch((erro)=>{
            var resultadoErro = erro.data
            console.log(resultadoErro)
        })
}
function exibirNaPaginaHtml(nome, tipo, habilidade, id) {
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
    var caminhoDescricao = document.getElementById("descricao");
    caminhoDescricao.innerHTML = `<p>${descricao}</p>`;
}
function mostrarDanos(damage, id) {
    var caminhoDanos = document.getElementById(id);
    caminhoDanos.innerHTML = `${damage}`;
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
  function resetInput(){
    var pesquisaPokemon = document.getElementById('pesquisaPokemon');
    pesquisaPokemon.value = "";
  }
  

