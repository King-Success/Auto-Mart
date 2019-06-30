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

wipeAlert = (nodes, btn = null, text = '') => {
    if (btn) btn.textContent = text;
    for (let i = 0; i < nodes.length; i++) {
        nodes[i].style.display = 'none';
    }
}

wipeForm = (fields) => {
    for(let i = 0; i < fields.length; i++){
        fields[i].value = ''
    }
  }