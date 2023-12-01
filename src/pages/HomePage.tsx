import {useLazyGetUserReposQuery, useSearchUsersQuery} from '../store/github/github.api'
import {useEffect, useState} from "react";
import {useDebounce} from "../hooks/debounce";
import {RepoCard} from "../components/RepoCard";

export function HomePage() {
    const [search, setSearch] = useState<string>('')
    const [dropdown, setDropdown] = useState<boolean>(false)
    const debounced = useDebounce(search)
    const {isLoading, isError, data} = useSearchUsersQuery(debounced, {
        skip: debounced.length < 3,
        refetchOnFocus: true
    })
    const [fetchRepos, {isLoading: areReposLoading, data: repos}] = useLazyGetUserReposQuery()
    const clickHandler = ((username: string) => {
        fetchRepos(username)
        setDropdown(false)
    })

    useEffect(() => {
        setDropdown(debounced.length > 3 && data?.length! > 0)
    }, [debounced, data])

    return <div className='flex justify-center pt-10 mx-auto h-screen w-screen'>{isError &&
        <p className='text-center text-red-600'>Something went wrong...</p>}
        <div className='relative w-[560px]'>
            <input className='border py-2 px-4 w-full h-[42px] mb-2' placeholder='Search for github username...'
                   type="text" value={search} onChange={e => setSearch(e.target.value)}/>
            {dropdown &&
                <ul  className='absolute list-none w-full top-[42px] left- 0 right-0 max-h-[200px] shadow-md bg-white overflow-y-scroll'>
                    {isLoading && <p className={'text-center'}>Loading...</p>}
                    {data?.map(user => (
                        <li onClick={() => clickHandler(user.login)}
                            className='py-2 px-4 hover:bg-gray-500  hover:text-white transition-colors cursor-pointer '
                            key={user.id}>{user.login}</li>
                    ))}
                </ul>}
            <div>
                {areReposLoading && <p className={'text-center'}>Repos are loading...</p>}
                {repos?.map(repo => (<RepoCard repo={repo} key={repo.id}/>))}

            </div>
        </div>

    </div>
}
