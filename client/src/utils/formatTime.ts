export const formatTime = (timestamp: string): string => {
    const date = new Date(timestamp)
    const year = date.getFullYear();
    const month = date.getMonth()
    const day = date.getDate();
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const formattedHours = hours % 12 || 12;
    const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
    const today = new Date();

    if(date.toDateString() === today.toDateString()) {
        return `${formattedHours}:${formattedMinutes} ${ampm}`;
    } else if (date.getTime() > today.getTime() - 7 * 24 * 60 * 60 * 1000) {
        return `${weekDays[date.getDay()]}, ${formattedHours}:${formattedMinutes} ${ampm}`;
    } else {
        return `${day}/${month + 1}/${year}`;
    }
    
}