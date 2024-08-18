export default function Page({ params }: { params: { post: string } }) {
    
    return <div>My Post: {params.post}</div>
}