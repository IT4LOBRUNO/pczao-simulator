const firebaseConfig = {
    apiKey: "AIzaSyC9gNUzpIvZWzzLrM9o4nx9c9r9PFU3UBE",
    authDomain: "pczao-simulator.firebaseapp.com",
    projectId: "pczao-simulator",
    storageBucket: "pczao-simulator.appspot.com",
    messagingSenderId: "206421728344",
    appId: "1:206421728344:web:73c5d9073441d0a57c3e2d"
  };
  
  firebase.initializeApp(firebaseConfig);
  const db = firebase.firestore();
  
  function formatTime(ms) {
    const totalSeconds = ms / 1000;
    const seconds = Math.floor(totalSeconds);
    const milliseconds = Math.floor((totalSeconds - seconds) * 1000);
    return `${seconds.toString().padStart(2, '0')}:${milliseconds.toString().padStart(3, '0')}`;
  }
  
  function carregarPlacar() {
    const placarContainer = document.getElementById('dados-placar');
    
    db.collection("resultados")
      .orderBy("tempo")
      .limit(10)
      .get()
      .then((querySnapshot) => {
        let posicao = 1;
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          const linha = document.createElement('div');
          linha.className = 'linha-placar';
          
          linha.innerHTML = `
            <div class="coluna posicao">${posicao}</div>
            <div class="coluna nome">${data.nome || 'Anônimo'}</div>
            <div class="coluna tempo">${formatTime(data.tempo)}</div>
          `;
          
          placarContainer.appendChild(linha);
          posicao++;
        });

        if (posicao === 1) {
          placarContainer.innerHTML = '<div class="sem-dados">Nenhum resultado ainda</div>';
        }
      })
      .catch((error) => {
        console.error("Erro ao carregar placar: ", error);
        placarContainer.innerHTML = '<div class="erro-carregamento">Erro ao carregar o placar</div>';
      });
  }
  
  document.addEventListener('DOMContentLoaded', carregarPlacar);