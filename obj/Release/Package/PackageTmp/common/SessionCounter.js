//ClientºÝTimeout¾÷¨î

function Counter(options) {
    var timer;
    var instance = this; 
    var currSecond = 0;
       
    var seconds = options.seconds || 10;
    var onUpdateStatus = options.onUpdateStatus || function () { };
    var onCounterEnd = options.onCounterEnd || function () { };
    var onCounterStart = options.onCounterStart || function () { };

    function decrementCounter() {
        onUpdateStatus(currSecond);
        if (currSecond === 0) {
            stopCounter();
            onCounterEnd();
            return;
        }
        currSecond--;
    };
    
    function startCounter() {
        currSecond = seconds;
        
        onCounterStart();
        clearInterval(timer);
        timer = 0;
        decrementCounter();
        timer = setInterval(decrementCounter, 1000);
    };
    
    function stopCounter() {
        clearInterval(timer);
    };
    
    function restartCounter() {
        stopCounter();
        startCounter();
    };
   
    return {
        start: function () {
            startCounter();
        },
        stop: function () {
            stopCounter();
        },
        restart: function () {
            restartCounter();
        }
    }
};
