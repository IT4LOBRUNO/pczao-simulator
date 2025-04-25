
let startTime;
let timerInterval;
let elapsedTime = 0;
let isTimerRunning = false;

//TIMER
function formatTime(ms) {
    const totalSeconds = ms / 1000;
    const seconds = Math.floor(totalSeconds);
    const milliseconds = Math.floor((totalSeconds - seconds) * 1000);
    
    return `${seconds.toString().padStart(2, '0')}:${milliseconds.toString().padStart(3, '0')}`;
}
  
  function updateTimerDisplay() {
    document.getElementById("timer-display").textContent = formatTime(elapsedTime);
  }
  
  function startTimer() {
    if (isTimerRunning) return;
    isTimerRunning = true;
    startTime = Date.now() - elapsedTime;
    timerInterval = setInterval(() => {
        elapsedTime = Date.now() - startTime;
        updateTimerDisplay();
    }, 10);
}
  
  function stopTimer() {
    if (!isTimerRunning) return;
    clearInterval(timerInterval);
    isTimerRunning = false;
    console.log("Tempo final:", formatTime(elapsedTime), "ms:", elapsedTime);
  }
  //TIMER

  //COMEÇO
  document.getElementById("btn-iniciar").addEventListener("click", () => {
    const canvas = document.getElementById("game-canvas");

    startTimer();

    if (!document.getElementById("placa-mae")) {
        const placaMae = document.createElement("img");
        placaMae.src = "imagens/placa-mae.png";
        placaMae.alt = "Placa Mãe";
        placaMae.id = "placa-mae";
        placaMae.classList.add("lado-esquerdo");
        placaMae.draggable = true;

        placaMae.style.width = "450px";
        placaMae.style.transition = "all 0.3s ease";

        placaMae.addEventListener("dragstart", (e) => {
            e.dataTransfer.setData("text/plain", "placa-mae");
            e.target.style.opacity = "0.7";
            e.target.style.transform = "scale(1.05)";
        });

        placaMae.addEventListener("dragend", (e) => {
            e.target.style.opacity = "1";
            e.target.style.transform = "scale(1)";
        });

        canvas.appendChild(placaMae);
    }

    if (!document.getElementById("slot-gabinete")) {
        const quadrado = document.createElement("div");
        quadrado.id = "slot-gabinete";
        quadrado.classList.add("slot-vermelho");

        quadrado.addEventListener("dragover", (e) => {
            e.preventDefault();
            e.target.style.transform = "scale(1.1)";
            e.target.style.backgroundColor = "rgba(0, 0, 255, 0.7)";
        });

        quadrado.addEventListener("dragleave", (e) => {
            e.target.style.transform = "scale(1)";
            e.target.style.backgroundColor = "red";
        });

        quadrado.addEventListener("drop", (e) => {
            e.preventDefault();
            const id = e.dataTransfer.getData("text/plain");
            const peça = document.getElementById(id);

            if (peça) {
                peça.style.position = "absolute";
                const quadRect = quadrado.getBoundingClientRect();
                const canvasRect = canvas.getBoundingClientRect();

                const offsetX = quadRect.left - canvasRect.left + (quadrado.offsetWidth / 2) - (peça.offsetWidth / 2);
                const offsetY = quadRect.top - canvasRect.top + (quadrado.offsetHeight / 2) - (peça.offsetHeight / 2);

                peça.style.left = `${offsetX}px`;
                peça.style.top = `${offsetY}px`;
                peça.setAttribute("draggable", "false");

                peça.style.transition = "all 0.3s ease";
                peça.style.transform = "scale(1.05)";
                setTimeout(() => {
                    peça.style.transform = "scale(1)";
                }, 300);

                quadrado.style.display = "none";

                addParafusosAndSlots(quadRect);
            }
        });

        canvas.appendChild(quadrado);
    }
});

let parafusosFixados = 0;
let processadorAdicionado = false;

function addParafusosAndSlots(quadRect) {
    const canvas = document.getElementById("game-canvas");
    const canvasRect = canvas.getBoundingClientRect();

    //POSIÇÃO DOS PARAFUSOS
    const parafusosPositions = [
        { x: 100, y: 200 },
        { x: 150, y: 200 },
        { x: 200, y: 200 },
        { x: 100, y: 150 },
        { x: 150, y: 150 },
        { x: 200, y: 150 }
    ];

    parafusosPositions.forEach((pos, index) => {
        const parafuso = document.createElement("img");
        parafuso.src = "imagens/parafuso.png";
        parafuso.alt = "Parafuso";
        parafuso.id = `parafuso-${index}`;
        parafuso.classList.add("parafuso");
        parafuso.draggable = true;

        parafuso.style.position = "absolute";
        parafuso.style.left = `${pos.x}px`;
        parafuso.style.top = `${pos.y}px`;
        parafuso.style.width = "30px";
        parafuso.style.height = "30px";
        parafuso.style.zIndex = "20";
        parafuso.style.transition = "all 0.3s ease";
        parafuso.style.cursor = "grab";

        parafuso.addEventListener("dragstart", (e) => {
            e.dataTransfer.setData("text", index);
            e.target.style.opacity = "0.7";
            e.target.style.transform = "scale(1.1) rotate(15deg)";
        });

        parafuso.addEventListener("dragend", (e) => {
            e.target.style.opacity = "1";
            e.target.style.transform = "scale(1) rotate(0deg)";
        });

        parafuso.addEventListener("mouseenter", () => {
            if (parafuso.draggable === "true") {
                parafuso.style.transform = "scale(1.05)";
            }
        });

        parafuso.addEventListener("mouseleave", () => {
            if (parafuso.draggable === "true") {
                parafuso.style.transform = "scale(1)";
            }
        });

        canvas.appendChild(parafuso);
    });

    //POSIÇÃO SLOTS
    const slotsPositions = [
        { x: 470, y: 132 },
        { x: 698, y: 132 },
        { x: 427, y: 403 },
        { x: 698, y: 403 },
        { x: 428, y: 477 },
        { x: 698, y: 477 }
    ];

    slotsPositions.forEach((pos, index) => {
        const novoQuadrado = document.createElement("div");
        novoQuadrado.classList.add("slot-vermelho-menor");
        novoQuadrado.style.position = "absolute";
        novoQuadrado.style.left = `${pos.x}px`;
        novoQuadrado.style.top = `${pos.y}px`;
        novoQuadrado.style.zIndex = "15";
        novoQuadrado.style.transition = "all 0.2s ease";

        novoQuadrado.addEventListener("dragover", (e) => {
            e.preventDefault();
            e.target.style.transform = "scale(1.1)";
            e.target.style.backgroundColor = "rgba(0, 0, 255, 0.7)";
        });

        novoQuadrado.addEventListener("dragleave", (e) => {
            e.target.style.transform = "scale(1)";
            e.target.style.backgroundColor = "red";
        });

        novoQuadrado.addEventListener("drop", (e) => {
            e.preventDefault();
            const parafusoIndex = e.dataTransfer.getData("text");
            const parafuso = document.getElementById(`parafuso-${parafusoIndex}`);
            
            if (parafuso) {
                parafuso.style.left = `${pos.x}px`;
                parafuso.style.top = `${pos.y}px`;
                parafuso.style.transform = "scale(1.1)";
                parafuso.setAttribute("draggable", "false");
                parafuso.classList.add("parafuso-encaixado");
                
                setTimeout(() => {
                    parafuso.style.transform = "scale(1)";
                    novoQuadrado.remove();
                }, 300);

                parafusosFixados++;
                
                if (parafusosFixados === 6) {
                    mostrarProcessador();
                }
            }
        });

        canvas.appendChild(novoQuadrado);
    });
}

function mostrarProcessador() {
    if (processadorAdicionado) return;

    const canvas = document.getElementById("game-canvas");
    const canvasRect = canvas.getBoundingClientRect();

    const processador = document.createElement("img");
    processador.src = "imagens/processador.png";
    processador.alt = "Processador";
    processador.id = "processador";
    processador.classList.add("processador");

    processador.style.position = "absolute";
    processador.style.left = "150px";
    processador.style.top = "150px";
    processador.style.width = "200px";
    processador.style.height = "150px";
    processador.style.zIndex = "100";
    processador.draggable = true;

    processador.addEventListener("dragstart", (e) => {
        e.dataTransfer.setData("text/plain", "processador");
        e.target.style.opacity = "0.7";
    });

    processador.addEventListener("dragend", (e) => {
        e.target.style.opacity = "1";
    });

    canvas.appendChild(processador);

    const slotProcessador = document.createElement("div");
    slotProcessador.id = "slot-processador";
    slotProcessador.classList.add("slot-vermelho-menor");
    slotProcessador.style.position = "absolute";
    slotProcessador.style.left = "590px";
    slotProcessador.style.top = "260px";
    slotProcessador.style.zIndex = "50";

    slotProcessador.addEventListener("dragover", (e) => {
        e.preventDefault();
        slotProcessador.style.transform = "scale(1.1)";
        slotProcessador.style.backgroundColor = "rgba(0, 0, 255, 0.7)";
    });

    slotProcessador.addEventListener("dragleave", (e) => {
        slotProcessador.style.backgroundColor = "red";
    });

    slotProcessador.addEventListener("drop", (e) => {
        e.preventDefault();
        const peça = document.getElementById("processador");
    
        if (peça) {
            const slotRect = slotProcessador.getBoundingClientRect();
            const offsetX = slotRect.left - canvasRect.left + (slotProcessador.offsetWidth / 2) - (peça.offsetWidth / 2);
            const offsetY = slotRect.top - canvasRect.top + (slotProcessador.offsetHeight / 2) - (peça.offsetHeight / 2);
    
            peça.style.left = `${offsetX}px`;
            peça.style.top = `${offsetY}px`;
            peça.style.zIndex = "100";
            peça.setAttribute("draggable", "false");
    
            peça.style.transition = "all 0.3s ease";
            peça.style.transform = "scale(1.05)";
            setTimeout(() => {
                peça.style.transform = "scale(1)";
            }, 300);
    
            slotProcessador.remove();
    
            mostrarPasta();
        }
    });

    canvas.appendChild(slotProcessador);
    processadorAdicionado = true;
}


function mostrarPasta() {
    const canvas = document.getElementById("game-canvas");
    const canvasRect = canvas.getBoundingClientRect();

    const pasta = document.createElement("img");
    pasta.src = "imagens/pasta.png";
    pasta.alt = "Pasta Térmica";
    pasta.id = "pasta";
    pasta.classList.add("pasta-termica");

    pasta.style.position = "absolute";
    pasta.style.left = "70px";
    pasta.style.top = "150px";
    pasta.style.width = "100px";
    pasta.style.height = "80px";
    pasta.style.zIndex = "100";
    pasta.draggable = true;

    pasta.addEventListener("dragstart", (e) => {
        e.dataTransfer.setData("text/plain", "pasta");
        e.target.style.opacity = "0.7";
    });

    pasta.addEventListener("dragend", (e) => {
        e.target.style.opacity = "1";
    });

    canvas.appendChild(pasta);

    const slotPasta = document.createElement("div");
    slotPasta.id = "slot-pasta";
    slotPasta.classList.add("slot-vermelho-menor");
    slotPasta.style.position = "absolute";
    slotPasta.style.left = "587px";
    slotPasta.style.top = "260px";
    slotPasta.style.width = "30px";
    slotPasta.style.height = "30px";
    slotPasta.style.zIndex = "110";

    slotPasta.addEventListener("dragover", (e) => {
        e.preventDefault();
        slotPasta.style.transform = "scale(1.1)";
        slotPasta.style.backgroundColor = "rgba(0, 0, 255, 0.7)";
    });

    slotPasta.addEventListener("dragleave", (e) => {
        slotPasta.style.backgroundColor = "red";
    });

    slotPasta.addEventListener("drop", (e) => {
        e.preventDefault();
        const peça = document.getElementById("pasta");

        if (peça) {
            const slotRect = slotPasta.getBoundingClientRect();
            const offsetX = slotRect.left - canvasRect.left + (slotPasta.offsetWidth / 2) - (peça.offsetWidth / 2);
            const offsetY = slotRect.top - canvasRect.top + (slotPasta.offsetHeight / 2) - (peça.offsetHeight / 2);

            peça.src = "imagens/aplicada.png";
            peça.alt = "Pasta Térmica Aplicada";
            

            peça.style.left = `${offsetX}px`;
            peça.style.top = `${offsetY}px`;
            peça.style.zIndex = "120";
            peça.setAttribute("draggable", "false");

            peça.style.transition = "all 0.3s ease";
            peça.style.transform = "scale(1.05)";
            setTimeout(() => {
                peça.style.transform = "scale(1)";
            }, 300);

            slotPasta.remove();

            mostrarCooler();
        }
    });

    canvas.appendChild(slotPasta);
}

function mostrarCooler() {
    const canvas = document.getElementById("game-canvas");
    const canvasRect = canvas.getBoundingClientRect();

    const cooler = document.createElement("img");
    cooler.src = "imagens/cooler.png";
    cooler.alt = "Cooler";
    cooler.id = "cooler";
    cooler.classList.add("cooler");

    cooler.style.position = "absolute";
    cooler.style.left = "150px"; 
    cooler.style.top = "350px";
    cooler.style.width = "200px";
    cooler.style.height = "200px";
    cooler.style.zIndex = "130";
    cooler.draggable = true;

    cooler.addEventListener("dragstart", (e) => {
        e.dataTransfer.setData("text/plain", "cooler");
        e.target.style.opacity = "0.7";
    });

    cooler.addEventListener("dragend", (e) => {
        e.target.style.opacity = "1";
    });

    canvas.appendChild(cooler);

    const slotCooler = document.createElement("div");
    slotCooler.id = "slot-cooler";
    slotCooler.classList.add("slot-vermelho-menor");
    slotCooler.style.position = "absolute";
    slotCooler.style.left = "575px";
    slotCooler.style.top = "250px";
    slotCooler.style.width = "50px";
    slotCooler.style.height = "50px";
    slotCooler.style.zIndex = "125";

    slotCooler.addEventListener("dragover", (e) => {
        e.preventDefault();
        slotCooler.style.transform = "scale(1.1)";
        slotCooler.style.backgroundColor = "rgba(0, 0, 255, 0.7)";
    });

    slotCooler.addEventListener("dragleave", (e) => {
        slotCooler.style.backgroundColor = "red";
    });

    slotCooler.addEventListener("drop", (e) => {
        e.preventDefault();
        const peça = document.getElementById("cooler");

        if (peça) {
            const slotRect = slotCooler.getBoundingClientRect();
            const offsetX = slotRect.left - canvasRect.left + (slotCooler.offsetWidth / 2) - (peça.offsetWidth / 2);
            const offsetY = slotRect.top - canvasRect.top + (slotCooler.offsetHeight / 2) - (peça.offsetHeight / 2);

            peça.style.left = `${offsetX}px`;
            peça.style.top = `${offsetY}px`;
            peça.style.zIndex = "130";
            peça.setAttribute("draggable", "false");

            peça.style.transition = "all 0.3s ease";
            peça.style.transform = "scale(1.05)";
            setTimeout(() => {
                peça.style.transform = "scale(1)";
            }, 300);

            slotCooler.remove();

            mostrarMemoria();
        }
    });

    canvas.appendChild(slotCooler);
}

function mostrarMemoria() {
    const canvas = document.getElementById("game-canvas");
    const canvasRect = canvas.getBoundingClientRect();

    const memoria = document.createElement("img");
    memoria.src = "imagens/memoria.png";
    memoria.alt = "Memória RAM";
    memoria.id = "memoria";
    memoria.classList.add("memoria-ram");

    memoria.style.position = "absolute";
    memoria.style.left = "150px"; 
    memoria.style.top = "150px";  
    memoria.style.width = "150px"; 
    memoria.style.height = "300px"; 
    memoria.style.zIndex = "140";
    memoria.draggable = true;

    memoria.addEventListener("dragstart", (e) => {
        e.dataTransfer.setData("text/plain", "memoria");
        e.target.style.opacity = "0.7";
    });

    memoria.addEventListener("dragend", (e) => {
        e.target.style.opacity = "1";
    });

    canvas.appendChild(memoria);

    const slotMemoria = document.createElement("div");
    slotMemoria.id = "slot-memoria";
    slotMemoria.classList.add("slot-vermelho-menor");
    slotMemoria.style.position = "absolute";
    slotMemoria.style.left = "680px";
    slotMemoria.style.top = "245px";
    slotMemoria.style.width = "40px";
    slotMemoria.style.height = "80px";
    slotMemoria.style.zIndex = "135";

    slotMemoria.addEventListener("dragover", (e) => {
        e.preventDefault();
        slotMemoria.style.transform = "scale(1.1)";
        slotMemoria.style.backgroundColor = "rgba(0, 0, 255, 0.7)";
    });

    slotMemoria.addEventListener("dragleave", (e) => {
        slotMemoria.style.backgroundColor = "red";
    });

    slotMemoria.addEventListener("drop", (e) => {
        e.preventDefault();
        const peça = document.getElementById("memoria");

        if (peça) {
            const slotRect = slotMemoria.getBoundingClientRect();
            const offsetX = slotRect.left - canvasRect.left + (slotMemoria.offsetWidth / 2) - (peça.offsetWidth / 2);
            const offsetY = slotRect.top - canvasRect.top + (slotMemoria.offsetHeight / 2) - (peça.offsetHeight / 2);

            peça.style.left = `${offsetX}px`;
            peça.style.top = `${offsetY}px`;
            peça.style.zIndex = "140";
            peça.setAttribute("draggable", "false");

            peça.style.transition = "all 0.3s ease";
            peça.style.transform = "scale(1.05)";
            setTimeout(() => {
                peça.style.transform = "scale(1)";
            }, 300);

            slotMemoria.remove();

            mostrarGPU();
        }
    });

    canvas.appendChild(slotMemoria);
}

function mostrarGPU() {
    const canvas = document.getElementById("game-canvas");
    const canvasRect = canvas.getBoundingClientRect();

    const gpu = document.createElement("img");
    gpu.src = "imagens/gpu.png";
    gpu.alt = "Placa de Vídeo";
    gpu.id = "gpu";
    gpu.classList.add("placa-video");

    gpu.style.position = "absolute";
    gpu.style.left = "50px"; 
    gpu.style.top = "300px";  
    gpu.style.width = "350px"; 
    gpu.style.height = "350px"; 
    gpu.style.zIndex = "150";
    gpu.draggable = true;

    gpu.addEventListener("dragstart", (e) => {
        e.dataTransfer.setData("text/plain", "gpu");
        e.target.style.opacity = "0.7";
    });

    gpu.addEventListener("dragend", (e) => {
        e.target.style.opacity = "1";
    });

    canvas.appendChild(gpu);

    const slotGPU = document.createElement("div");
    slotGPU.id = "slot-gpu";
    slotGPU.classList.add("slot-vermelho-menor");
    slotGPU.style.position = "absolute";
    slotGPU.style.left = "530px";
    slotGPU.style.top = "400px";
    slotGPU.style.width = "50px";
    slotGPU.style.height = "50px";
    slotGPU.style.zIndex = "145";

    slotGPU.addEventListener("dragover", (e) => {
        e.preventDefault();
        slotGPU.style.transform = "scale(1.1)";
        slotGPU.style.backgroundColor = "rgba(0, 0, 255, 0.7)";
    });

    slotGPU.addEventListener("dragleave", (e) => {
        slotGPU.style.backgroundColor = "red";
    });

    slotGPU.addEventListener("drop", (e) => {
        e.preventDefault();
        const peça = document.getElementById("gpu");

        if (peça) {
            const slotRect = slotGPU.getBoundingClientRect();
            const offsetX = slotRect.left - canvasRect.left + (slotGPU.offsetWidth / 2) - (peça.offsetWidth / 2);
            const offsetY = slotRect.top - canvasRect.top + (slotGPU.offsetHeight / 2) - (peça.offsetHeight / 2);

            peça.style.left = `${offsetX}px`;
            peça.style.top = `${offsetY}px`;
            peça.style.zIndex = "150";
            peça.setAttribute("draggable", "false");

            peça.style.transition = "all 0.3s ease";
            peça.style.transform = "scale(1.05)";
            setTimeout(() => {
                peça.style.transform = "scale(1)";
            }, 300);

            slotGPU.remove();

            mostrarFonte();
        }
    });

    canvas.appendChild(slotGPU);
}

function mostrarFonte() {
    const canvas = document.getElementById("game-canvas");
    const canvasRect = canvas.getBoundingClientRect();

    const fonte = document.createElement("img");
    fonte.src = "imagens/fonte.png";
    fonte.alt = "Fonte de Alimentação";
    fonte.id = "fonte";
    fonte.classList.add("fonte-alimentacao");

    fonte.style.position = "absolute";
    fonte.style.left = "150px";
    fonte.style.top = "150px"; 
    fonte.style.width = "200px";
    fonte.style.height = "150px";
    fonte.style.zIndex = "160";
    fonte.draggable = true;

    fonte.addEventListener("dragstart", (e) => {
        e.dataTransfer.setData("text/plain", "fonte");
        e.target.style.opacity = "0.7";
    });

    fonte.addEventListener("dragend", (e) => {
        e.target.style.opacity = "1";
    });

    canvas.appendChild(fonte);

    const slotFonte = document.createElement("div");
    slotFonte.id = "slot-fonte";
    slotFonte.classList.add("slot-vermelho-menor");
    slotFonte.style.position = "absolute";
    slotFonte.style.left = "455px";
    slotFonte.style.top = "585px";
    slotFonte.style.width = "60px";
    slotFonte.style.height = "60px";
    slotFonte.style.zIndex = "155";

    slotFonte.addEventListener("dragover", (e) => {
        e.preventDefault();
        slotFonte.style.transform = "scale(1.1)";
        slotFonte.style.backgroundColor = "rgba(0, 0, 255, 0.7)";
    });

    slotFonte.addEventListener("dragleave", (e) => {
        slotFonte.style.backgroundColor = "red";
    });

    slotFonte.addEventListener("drop", (e) => {
        e.preventDefault();
        const peça = document.getElementById("fonte");

        if (peça) {
            const slotRect = slotFonte.getBoundingClientRect();
            const offsetX = slotRect.left - canvasRect.left + (slotFonte.offsetWidth / 2) - (peça.offsetWidth / 2);
            const offsetY = slotRect.top - canvasRect.top + (slotFonte.offsetHeight / 2) - (peça.offsetHeight / 2);

            peça.style.left = `${offsetX}px`;
            peça.style.top = `${offsetY}px`;
            peça.style.zIndex = "160";
            peça.setAttribute("draggable", "false");

            peça.style.transition = "all 0.3s ease";
            peça.style.transform = "scale(1.05)";
            setTimeout(() => {
                peça.style.transform = "scale(1)";
            }, 300);

            slotFonte.remove();

            mostrarSSD();
        }
    });

    canvas.appendChild(slotFonte);
}

function mostrarSSD() {
    const canvas = document.getElementById("game-canvas");
    const canvasRect = canvas.getBoundingClientRect();

    const ssd = document.createElement("img");
    ssd.src = "imagens/ssd.png";
    ssd.alt = "SSD";
    ssd.id = "ssd";
    ssd.classList.add("ssd");

    ssd.style.position = "absolute";
    ssd.style.left = "150px";
    ssd.style.top = "150px"; 
    ssd.style.width = "110px";
    ssd.style.height = "150px";
    ssd.style.zIndex = "160";
    ssd.draggable = true;

    ssd.addEventListener("dragstart", (e) => {
        e.dataTransfer.setData("text/plain", "ssd");
        e.target.style.opacity = "0.7";
    });

    ssd.addEventListener("dragend", (e) => {
        e.target.style.opacity = "1";
    });

    canvas.appendChild(ssd);

    const slotSSD = document.createElement("div");
    slotSSD.id = "slot-ssd";
    slotSSD.classList.add("slot-vermelho-menor");
    slotSSD.style.position = "absolute";
    slotSSD.style.left = "780px";
    slotSSD.style.top = "394px"; 
    slotSSD.style.width = "60px";
    slotSSD.style.height = "60px";
    slotSSD.style.zIndex = "155";

    slotSSD.addEventListener("dragover", (e) => {
        e.preventDefault();
        slotSSD.style.transform = "scale(1.1)";
        slotSSD.style.backgroundColor = "rgba(0, 0, 255, 0.7)";
    });

    slotSSD.addEventListener("dragleave", (e) => {
        slotSSD.style.backgroundColor = "red";
    });

    slotSSD.addEventListener("drop", (e) => {
        e.preventDefault();
        const peça = document.getElementById("ssd");

        if (peça) {
            const slotRect = slotSSD.getBoundingClientRect();
            const offsetX = slotRect.left - canvasRect.left + (slotSSD.offsetWidth / 2) - (peça.offsetWidth / 2);
            const offsetY = slotRect.top - canvasRect.top + (slotSSD.offsetHeight / 2) - (peça.offsetHeight / 2);

            peça.style.left = `${offsetX}px`;
            peça.style.top = `${offsetY}px`;
            peça.style.zIndex = "160";
            peça.setAttribute("draggable", "false");

            peça.style.transition = "all 0.3s ease";
            peça.style.transform = "scale(1.05)";
            setTimeout(() => {
                peça.style.transform = "scale(1)";
            }, 300);

            slotSSD.remove();

            mostrarSATA();
        }
    });

    canvas.appendChild(slotSSD);
}

function mostrarSATA() {
    const canvas = document.getElementById("game-canvas");
    const canvasRect = canvas.getBoundingClientRect();

    const sata = document.createElement("img");
    sata.src = "imagens/sata.png";
    sata.alt = "Cabo SATA";
    sata.id = "sata";
    sata.classList.add("cabo-sata");

    sata.style.position = "absolute";
    sata.style.left = "150px";
    sata.style.top = "150px"; 
    sata.style.width = "200px";
    sata.style.height = "80px";
    sata.style.zIndex = "160";
    sata.draggable = true;

    sata.addEventListener("dragstart", (e) => {
        e.dataTransfer.setData("text/plain", "sata");
        e.target.style.opacity = "0.7";
    });

    sata.addEventListener("dragend", (e) => {
        e.target.style.opacity = "1";
    });

    canvas.appendChild(sata);

    const slotSATA = document.createElement("div");
    slotSATA.id = "slot-sata";
    slotSATA.classList.add("slot-vermelho-menor");
    slotSATA.style.position = "absolute";
    slotSATA.style.left = "748px"; 
    slotSATA.style.top = "500px";  
    slotSATA.style.width = "40px";
    slotSATA.style.height = "30px";
    slotSATA.style.zIndex = "165";

    slotSATA.addEventListener("dragover", (e) => {
        e.preventDefault();
        slotSATA.style.transform = "scale(1.1)";
        slotSATA.style.backgroundColor = "rgba(0, 0, 255, 0.7)";
    });

    slotSATA.addEventListener("dragleave", (e) => {
        slotSATA.style.backgroundColor = "red";
    });

    slotSATA.addEventListener("drop", (e) => {
        e.preventDefault();
        const peça = document.getElementById("sata");

        if (peça) {
            const slotRect = slotSATA.getBoundingClientRect();
            const offsetX = slotRect.left - canvasRect.left + (slotSATA.offsetWidth / 2) - (peça.offsetWidth / 2);
            const offsetY = slotRect.top - canvasRect.top + (slotSATA.offsetHeight / 2) - (peça.offsetHeight / 2);

            peça.style.left = `${offsetX}px`;
            peça.style.top = `${offsetY}px`;
            peça.style.zIndex = "160";
            peça.setAttribute("draggable", "false");

            peça.style.transition = "all 0.3s ease";
            peça.style.transform = "scale(1.05)";
            setTimeout(() => {
                peça.style.transform = "scale(1)";
            }, 300);

            slotSATA.remove();

            mostrarConector0()
        }
    });

    canvas.appendChild(slotSATA);
}

function mostrarConector0() {
    const canvas = document.getElementById("game-canvas");
    const canvasRect = canvas.getBoundingClientRect();

    const conector0 = document.createElement("img");
    conector0.src = "imagens/conector0.png";
    conector0.alt = "Conector 0";
    conector0.id = "conector0";
    conector0.classList.add("conector-zero");

    conector0.style.position = "absolute";
    conector0.style.left = "150px";
    conector0.style.top = "150px"; 
    conector0.style.width = "100px";
    conector0.style.height = "60px";
    conector0.style.zIndex = "170";
    conector0.draggable = true;

    conector0.addEventListener("dragstart", (e) => {
        e.dataTransfer.setData("text/plain", "conector0");
        e.target.style.opacity = "0.7";
        e.target.style.transform = "rotate(10deg)";
    });

    conector0.addEventListener("dragend", (e) => {
        e.target.style.opacity = "1";
        e.target.style.transform = "rotate(0deg)";
    });

    canvas.appendChild(conector0);

    const slotConector0 = document.createElement("div");
    slotConector0.id = "slot-conector0";
    slotConector0.classList.add("slot-vermelho-menor");
    slotConector0.style.position = "absolute";
    slotConector0.style.left = "810px";
    slotConector0.style.top = "485px"; 
    slotConector0.style.width = "50px";
    slotConector0.style.height = "30px";
    slotConector0.style.zIndex = "165";

    slotConector0.addEventListener("dragover", (e) => {
        e.preventDefault();
        slotConector0.style.transform = "scale(1.1)";
        slotConector0.style.backgroundColor = "rgba(0, 0, 255, 0.7)";
    });

    slotConector0.addEventListener("dragleave", (e) => {
        slotConector0.style.transform = "scale(1)";
        slotConector0.style.backgroundColor = "red";
    });

    slotConector0.addEventListener("drop", (e) => {
        e.preventDefault();
        const peça = document.getElementById("conector0");

        if (peça) {
            const slotRect = slotConector0.getBoundingClientRect();
            const offsetX = slotRect.left - canvasRect.left + (slotConector0.offsetWidth / 2) - (peça.offsetWidth / 2);
            const offsetY = slotRect.top - canvasRect.top + (slotConector0.offsetHeight / 2) - (peça.offsetHeight / 2);

            peça.style.left = `${offsetX}px`;
            peça.style.top = `${offsetY}px`;
            peça.style.zIndex = "170";
            peça.setAttribute("draggable", "false");

            peça.style.transition = "all 0.3s ease";
            peça.style.transform = "scale(1.05) rotate(0deg)";
            setTimeout(() => {
                peça.style.transform = "scale(1)";
            }, 300);

            slotConector0.remove();
            
            mostrarConector1();
        }
    });

    canvas.appendChild(slotConector0);
}

function mostrarConector1() {
    const canvas = document.getElementById("game-canvas");
    const canvasRect = canvas.getBoundingClientRect();

    const conector = document.createElement("img");
    conector.src = "imagens/conector1.png";
    conector.alt = "Conector de Energia";
    conector.id = "conector1";
    conector.classList.add("conector-energia");

    conector.style.position = "absolute";
    conector.style.left = "650px";
    conector.style.top = "580px";
    conector.style.width = "80px";
    conector.style.height = "120px";
    conector.style.zIndex = "170";
    conector.draggable = true;

    conector.addEventListener("dragstart", (e) => {
        e.dataTransfer.setData("text/plain", "conector1");
        e.target.style.opacity = "0.7";
    });

    conector.addEventListener("dragend", (e) => {
        e.target.style.opacity = "1";
    });

    canvas.appendChild(conector);

    const slotConector = document.createElement("div");
    slotConector.id = "slot-conector1";
    slotConector.classList.add("slot-vermelho-menor");
    slotConector.style.position = "absolute";
    slotConector.style.left = "765px";
    slotConector.style.top = "300px";
    slotConector.style.width = "20px";
    slotConector.style.height = "40px";
    slotConector.style.zIndex = "165";

    slotConector.addEventListener("dragover", (e) => {
        e.preventDefault();
        slotConector.style.transform = "scale(1.1)";
        slotConector.style.backgroundColor = "rgba(0, 0, 255, 0.7)";
    });

    slotConector.addEventListener("dragleave", (e) => {
        slotConector.style.backgroundColor = "red";
    });

    slotConector.addEventListener("drop", (e) => {
        e.preventDefault();
        const peça = document.getElementById("conector1");

        if (peça) {
            const slotRect = slotConector.getBoundingClientRect();
            const offsetX = slotRect.left - canvasRect.left + (slotConector.offsetWidth / 2) - (peça.offsetWidth / 2);
            const offsetY = slotRect.top - canvasRect.top + (slotConector.offsetHeight / 2) - (peça.offsetHeight / 2);

            peça.style.left = `${offsetX}px`;
            peça.style.top = `${offsetY}px`;
            peça.style.zIndex = "170";
            peça.setAttribute("draggable", "false");

            peça.style.transition = "all 0.3s ease";
            peça.style.transform = "scale(1.05)";
            setTimeout(() => {
                peça.style.transform = "scale(1)";
            }, 300);

            slotConector.remove();

            mostrarConector2();
        }
    });

    canvas.appendChild(slotConector);
}

function mostrarConector2() {
    const canvas = document.getElementById("game-canvas");
    const canvasRect = canvas.getBoundingClientRect();

    const conector2 = document.createElement("img");
    conector2.src = "imagens/conector2.png";
    conector2.alt = "Conector 2";
    conector2.id = "conector2";
    conector2.classList.add("conector");

    conector2.style.position = "absolute";
    conector2.style.left = "150px";
    conector2.style.top = "150px";
    conector2.style.width = "60px";
    conector2.style.height = "40px";
    conector2.style.zIndex = "170";
    conector2.draggable = true;

    conector2.addEventListener("dragstart", (e) => {
        e.dataTransfer.setData("text/plain", "conector2");
        e.target.style.opacity = "0.7";
    });

    conector2.addEventListener("dragend", (e) => {
        e.target.style.opacity = "1";
    });

    canvas.appendChild(conector2);

    const slotConector2 = document.createElement("div");
    slotConector2.id = "slot-conector2";
    slotConector2.classList.add("slot-vermelho-menor");
    slotConector2.style.position = "absolute";
    slotConector2.style.left = "492px";
    slotConector2.style.top = "125px";
    slotConector2.style.width = "40px";
    slotConector2.style.height = "30px";
    slotConector2.style.zIndex = "165";

    slotConector2.addEventListener("dragover", (e) => {
        e.preventDefault();
        slotConector2.style.transform = "scale(1.1)";
        slotConector2.style.backgroundColor = "rgba(0, 0, 255, 0.7)";
    });

    slotConector2.addEventListener("dragleave", (e) => {
        slotConector2.style.backgroundColor = "red";
    });

    slotConector2.addEventListener("drop", (e) => {
        e.preventDefault();
        const peça = document.getElementById("conector2");

        if (peça) {
            const slotRect = slotConector2.getBoundingClientRect();
            const offsetX = slotRect.left - canvasRect.left + (slotConector2.offsetWidth / 2) - (peça.offsetWidth / 2);
            const offsetY = slotRect.top - canvasRect.top + (slotConector2.offsetHeight / 2) - (peça.offsetHeight / 2);

            peça.style.left = `${offsetX}px`;
            peça.style.top = `${offsetY}px`;
            peça.style.zIndex = "170";
            peça.setAttribute("draggable", "false");

            peça.style.transition = "all 0.3s ease";
            peça.style.transform = "scale(1.05)";
            setTimeout(() => {
                peça.style.transform = "scale(1)";
            }, 300);

            slotConector2.remove();

            mostrarConector3();
        }
    });

    canvas.appendChild(slotConector2);
}

function mostrarConector3() {
    const canvas = document.getElementById("game-canvas");
    const canvasRect = canvas.getBoundingClientRect();

    const conector3 = document.createElement("img");
    conector3.src = "imagens/conector3.png";
    conector3.alt = "Conector 3";
    conector3.id = "conector3";
    conector3.classList.add("conector");

    conector3.style.position = "absolute";
    conector3.style.left = "150px";
    conector3.style.top = "150px";
    conector3.style.width = "50px";
    conector3.style.height = "70px";
    conector3.style.zIndex = "180";
    conector3.draggable = true;

    conector3.addEventListener("dragstart", (e) => {
        e.dataTransfer.setData("text/plain", "conector3");
        e.target.style.opacity = "0.7";
    });

    conector3.addEventListener("dragend", (e) => {
        e.target.style.opacity = "1";
    });

    canvas.appendChild(conector3);

    const slotConector3 = document.createElement("div");
    slotConector3.id = "slot-conector3";
    slotConector3.classList.add("slot-vermelho-menor");
    slotConector3.style.position = "absolute";
    slotConector3.style.left = "635px";
    slotConector3.style.top = "130px";
    slotConector3.style.width = "40px";
    slotConector3.style.height = "30px";
    slotConector3.style.zIndex = "175";

    slotConector3.addEventListener("dragover", (e) => {
        e.preventDefault();
        slotConector3.style.transform = "scale(1.1)";
        slotConector3.style.backgroundColor = "rgba(0, 0, 255, 0.7)";
    });

    slotConector3.addEventListener("dragleave", (e) => {
        slotConector3.style.backgroundColor = "red";
    });

    slotConector3.addEventListener("drop", (e) => {
        e.preventDefault();
        const peça = document.getElementById("conector3");

        if (peça) {
            const slotRect = slotConector3.getBoundingClientRect();
            const offsetX = slotRect.left - canvasRect.left + (slotConector3.offsetWidth / 2) - (peça.offsetWidth / 2);
            const offsetY = slotRect.top - canvasRect.top + (slotConector3.offsetHeight / 2) - (peça.offsetHeight / 2);

            peça.style.left = `${offsetX}px`;
            peça.style.top = `${offsetY}px`;
            peça.style.zIndex = "180";
            peça.setAttribute("draggable", "false");

            peça.style.transition = "all 0.3s ease";
            peça.style.transform = "scale(1.05)";
            setTimeout(() => {
                peça.style.transform = "scale(1)";
                slotConector3.remove();
                
                powerOn();
            }, 300);
        }
    });

    canvas.appendChild(slotConector3);
}

function powerOn() {
    const powerButton = document.getElementById("power-off");
    
    powerButton.src = "imagens/power-on.png";
    powerButton.alt = "Botão Power On";
    
    powerButton.style.pointerEvents = "auto";
    powerButton.style.cursor = "pointer";
    
    powerButton.addEventListener("click", () => {
        stopTimer();
        showGameOverModal();
    });
    
    powerButton.style.transition = "transform 0.3s ease";
    powerButton.style.transform = "scale(1.1)";
    setTimeout(() => {
        powerButton.style.transform = "scale(1)";
    }, 300);
}

function showGameOverModal() {
    const modal = document.getElementById("game-over-modal");
    const finalTimeDisplay = document.getElementById("final-time");
    
    finalTimeDisplay.textContent = formatTime(elapsedTime);
    
    modal.style.display = "block";
    
    document.getElementById("save-score").addEventListener("click", async () => {
        const playerName = document.getElementById("player-name").value.trim();
        
        if (playerName) {
            try {
                await db.collection("resultados").add({
                    nome: playerName,
                    tempo: elapsedTime,
                    data: firebase.firestore.FieldValue.serverTimestamp()
                });
                
                modal.style.display = "none";
                
                alert(`Pontuação de ${playerName} salva com sucesso! Tempo: ${formatTime(elapsedTime)}`);
            } catch (error) {
                console.error("Erro ao salvar pontuação: ", error);
                alert("Ocorreu um erro ao salvar sua pontuação. Tente novamente.");
            }
        } else {
            alert("Por favor, digite seu nome!");
        }
    });
}