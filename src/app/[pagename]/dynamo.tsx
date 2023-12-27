interface PageProps {
    params: {
        pagename: string
    }
}

export default function dynamo({ params }: PageProps){
    return(
        <div>
            <h1>{params.pagename} jj dynamic routing ale</h1>
        </div>
    )
}