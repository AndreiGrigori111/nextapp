interface PageProps {
    params: {
        pagename: string
    }
}

export default function Page({ params }: PageProps){
    return(
        <div>
            <h1>{params.pagename} dynamic routing kappa</h1>
        </div>
    )
}