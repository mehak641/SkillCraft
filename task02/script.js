
    class Calculator {
      constructor() {
        this.currentInput = '0';
        this.expressionDisplay = document.getElementById('expression');
        this.resultDisplay = document.getElementById('result');
        this.historyList = document.getElementById('history-list');
        this.history = [];
        this.updateDisplay();
      }

      updateDisplay() {
        this.resultDisplay.textContent = this.currentInput;
        this.expressionDisplay.textContent = this.currentInput === '0' ? 'Ready' : this.currentInput;
      }

      append(value) {
        if (this.currentInput === '0') this.currentInput = value;
        else this.currentInput += value;
        this.updateDisplay();
      }

      clearAll() {
        this.currentInput = '0';
        this.updateDisplay();
      }

      clearEntry() {
        this.currentInput = this.currentInput.slice(0, -1) || '0';
        this.updateDisplay();
      }

      calculate() {
        try {
          let result = eval(this.currentInput.replace(/÷/g,'/').replace(/×/g,'*'));
          this.addHistory(`${this.currentInput} = ${result}`);
          this.currentInput = String(result);
          this.updateDisplay();
        } catch {
          this.resultDisplay.textContent = 'Error';
        }
      }

      addHistory(entry) {
        this.history.unshift(entry);
        this.historyList.innerHTML = this.history.map(h => `<div class="history-item">${h}</div>`).join('');
      }

      square() {
        let val = eval(this.currentInput);
        this.currentInput = String(val * val);
        this.addHistory(`(${val})² = ${this.currentInput}`);
        this.updateDisplay();
      }

      sqrt() {
        let val = eval(this.currentInput);
        this.currentInput = String(Math.sqrt(val));
        this.addHistory(`√(${val}) = ${this.currentInput}`);
        this.updateDisplay();
      }

      reciprocal() {
        let val = eval(this.currentInput);
        if(val === 0) { this.resultDisplay.textContent="Error"; return; }
        this.currentInput = String(1/val);
        this.addHistory(`1/(${val}) = ${this.currentInput}`);
        this.updateDisplay();
      }
    }

    const calc = new Calculator();

    function appendToDisplay(val){ calc.append(val); }
    function clearAll(){ calc.clearAll(); }
    function clearEntry(){ calc.clearEntry(); }
    function calculate(){ calc.calculate(); }
    function square(){ calc.square(); }
    function sqrt(){ calc.sqrt(); }
    function reciprocal(){ calc.reciprocal(); }
function backspace(){ calc.clearEntry(); }

    // ✅ Keyboard support
    document.addEventListener("keydown", (e) => {
      if (!isNaN(e.key) || "+-*/.%".includes(e.key)) {
        appendToDisplay(e.key);
      } else if (e.key === "Enter") {
        calculate();
      } else if (e.key === "Backspace") {
        clearEntry();
      } else if (e.key === "Escape") {
        clearAll();
      } else if (e.key === "^") {
        square();
      }
    });
  
