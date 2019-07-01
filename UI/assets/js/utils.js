const formatDate = (timestamp) => {
    const months = {
        '01': 'Jan',
        '02': 'Feb',
        '03': 'March',
        '04': 'April',
        '05': 'May',
        '06': 'June',
        '07': 'July',
        '08': 'Augt',
        '09': 'Sept',
        '10': 'Oct',
        '11': 'Nov',
        '12': 'Dec'
    }
    try {
        const date = timestamp.split('T')[0]
        const parts = date.split('-')
        return `${parts[2]} ${months[parts[1]]} ${parts[0]}`
    } catch (e) {
        return timestamp
    }
}

//credit: https://stackoverflow.com/questions/149055/how-can-i-format-numbers-as-currency-string-in-javascript?page=1&tab=votes#tab-top
function formatMoney(amount, decimalCount = 2, decimal = ".", thousands = ",") {
    try {
        decimalCount = Math.abs(decimalCount);
        decimalCount = isNaN(decimalCount) ? 2 : decimalCount;

        const negativeSign = amount < 0 ? "-" : "";

        let i = parseInt(amount = Math.abs(Number(amount) || 0).toFixed(decimalCount)).toString();
        let j = (i.length > 3) ? i.length % 3 : 0;

        return negativeSign + (j ? i.substr(0, j) + thousands : '') + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + thousands) + (decimalCount ? decimal + Math.abs(amount - i).toFixed(decimalCount).slice(2) : "");
    } catch (e) {
        console.log(e)
    }
};

wipeAlert = (nodes, btn = null, text = '') => {
    if (btn) btn.textContent = text;
    for (let i = 0; i < nodes.length; i++) {
        nodes[i].style.display = 'none';
    }
}

wipeForm = (fields) => {
    for (let i = 0; i < fields.length; i++) {
        fields[i].value = ''
    }
}