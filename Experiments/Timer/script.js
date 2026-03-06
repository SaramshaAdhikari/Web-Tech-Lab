<script>
    const timerElement = document.createElement('div');
    timerElement.classList.add('timer');
    document.body.appendChild(timerElement);

    let seconds = 0;

    function updateTimer() {
        seconds++;
        timerElement.textContent = `Timer: ${seconds} seconds`;
    }

    setInterval(updateTimer, 1000);

</script>