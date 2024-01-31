'use client'
import { Separator } from "@/components/ui/separator"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card"
import { Button } from '@/components/ui/button'
import axios from 'axios'
import { url } from '@/lib/url'
import { Item } from '@radix-ui/react-radio-group'
import Link from 'next/link'
import React, { useEffect } from 'react'
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useRecoilValue } from 'recoil'
import { UserProfile } from '@/components/atoms/userAuth'
import jwt from 'jsonwebtoken'
import { useState } from 'react'
import { useToast } from '@/components/ui/use-toast'
import { useRouter } from 'next/navigation'

const AdminDetails = async({params}) => {
    const {toast} = useToast()
    const [UserInfo, setUserInfo] = useState('')
    const user = useRecoilValue(UserProfile)
    const decodedEmail = jwt.decode(user,process.env.SECRET_KEY) 
    const [Name, setName] = useState()
    const [Email, setEmail] = useState(UserInfo.email)
    const [Role, setRole] = useState("false")
    const navigation = useRouter()

    const fetchRequest = async (userID) => {
      const { data:data } = await axios.post(`${url}/api/UserDetails`, {
        userID
      })
      setUserInfo(data.user)
    }
      console.log(Name)
  
      const updateChangeHandler  = async()=>{
          const { data } = await axios.put(`${url}/api/updateRole`, {
            userID:params.slug , role:Role
              })
                  if(data.success===true){
                        toast({
                          description:"Profile Updated Successfullly",
                          variant:"custom"
                        })
                        navigation.push('/adminUsers')
                  } else {
                        toast({
                          description: "Something went wrong",
                          variant:"custom"
                        })
                  }
          
        }
  
      useEffect(() => {
        if(decodedEmail.user._id){
          fetchRequest(decodedEmail.user._id)
        }
  
      }, [])
      useEffect(() => {
        // Update Name and Email states when UserInfo changes
        if (UserInfo) {
          setName(UserInfo.name);
          setEmail(UserInfo.email);
        }
      }, [UserInfo]); 
  return (
    <div className='flex gap-2' >
            <div className='m-4 w-[20%] ' >
            <div className="space-y-1">
                <h4 className="text-sm font-medium leading-none">User Details</h4>
                <p className="text-sm text-muted-foreground">
                    Manage user details and permissions
                </p>
            </div>
            <Separator className="my-4" />
            <div className='text-sm' > <Link href={'/orders'}>Back</Link> </div>
             <Separator orientation="vertical" />
            </div>
            <div className=' w-[80%]' >
             <div className='' >
                <div className='' >
                <Card 
                className=" border-none"
                >
                        <CardHeader>
                            <CardTitle>Manage User Access</CardTitle>
                            <CardDescription>Manage and Track your Order</CardDescription>
                        </CardHeader>
                        
                        <CardContent>
                        <div>
            <Card className="w-[350px] m-auto ">
            <CardHeader>
                <CardTitle>Update Profile</CardTitle>
                <CardDescription>Manage your account</CardDescription>
            </CardHeader>
            <CardContent>
                <form>
                <div className="grid w-full items-center gap-4">
                    <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="name">User Name</Label>
                    <Input id="name"  readOnly={true} onChange={(e)=>setName(e.target.value)}  placeholder={UserInfo?.name}  value={Name} />
                    </div>
                    <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="name">User Email</Label>
                    <Input id="Email" readOnly={true} onChange={(e)=>setEmail(e.target.value)} placeholder={UserInfo?.email} value={Email}  />
                    </div>
                    <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="name">Change Permission</Label><br></br>
                    <Label  > User Role </Label> 
                    <select  className=" text-sm border-[0.4px] border-black" onChange={(e)=>setRole(e.target.value)} >
                        <option value={"false"}> User { " (Default)" } </option>
                        <option value={"true"}>Admin</option>
                    </select>
                    </div>
                </div>
                </form>
            </CardContent>
            <CardFooter className="flex justify-between ">
                <Link href={'/adminUsers'}> <Button className='bg-red-800 hover:bg-red-900 text-white '>Discard Changes </Button></Link>
                <Button className='text-white' onClick={updateChangeHandler} >Update Changes</Button>
            </CardFooter>
            </Card>
            </div>
            </CardContent>
            </Card>
                </div>
             </div>
        </div>
    </div>
  )
}

export default AdminDetails

// async function getData(params){
//     const { data } = await axios.post(`${url}/api/UserDetails`,{
//         userID:params
//     })
//     return data
// }