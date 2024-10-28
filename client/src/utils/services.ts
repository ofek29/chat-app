
export const baseUrl = import.meta.env.VITE_API_BASE_URL;

export const fetchFromApi = async (url: string, body: string) => {

    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body,
    });

    const data = await response.json();
    if (!response.ok) {
        let message;
        if (data?.message) {
            message = data.message;
        } else {
            message = data;
        }
        return { error: true, message }
    }

    return data;
}

export const getFromApi = async (url: string) => {

    const response = await fetch(url);
    if (!response.ok) {
        // let message = "get from API failed, error occurred";
        // if (response.error) {
        // //     message = data.message;
        // // } else {
        // //     message = data;
        // // }
        return { error: true, response };
    }
    const data = await response.json();
    return data;
};