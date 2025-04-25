document.getElementById('startBtn').onclick = function () {
    document.getElementById('menu').style.display = 'none';
    document.getElementById('game').style.display = 'block';
  };
  
  document.getElementById('instructionsBtn').onclick = function () {
    document.getElementById('menu').style.display = 'none';
    document.getElementById('instructions').style.display = 'block';
  };
  
  function voltarMenu() {
    document.getElementById('instructions').style.display = 'none';
    document.getElementById('menu').style.display = 'block';
  }
  