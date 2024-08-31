"use client"
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { AiChatSession } from "@/configs/AiModel";
import { useUser } from "@clerk/nextjs";
import { JsonForms } from "@/configs/schema";
import moment from "moment/moment";
import { db } from "@/configs";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

const PROMPT=",On  Basis of description create JSON form with formTitle,formHeading along with fieldName, FieldTitle, FieldType, Placeholder, label, required field in JSON format only i don,t explanation";

function CreateForm() {
    const [openDialog,setOpenDialog]=useState(false);
    const [userInput,setUserInput]=useState();
    const [loading,setLoading]=useState();

    const {user}=useUser();

    const route=useRouter();

    const onCreateForm=async()=>{
        setLoading(true);
      const result=await AiChatSession.sendMessage("Description:"+userInput+PROMPT);

      const MockJsonResp=(result.response.text()).replace('```json','').replace('```','')
      console.log(result.response.text())

      console.log(MockJsonResp);

        
      if(MockJsonResp)
        {
        const resp=await db.insert(JsonForms)
        .values({
          jsonform:MockJsonResp,
          createdBy:user?.primaryEmailAddress?.emailAddress,
          createdAt:moment().format('DD/MM/yyyy')
        }).returning({id:JsonForms.id});
        console.log("new form id ",resp[0].id);
        if(resp[0].id)
        {
          route.push('/edit-form/'+resp[0].id);
        }
        setLoading(false);
      }
      setLoading(false);
    }
  return (
    <div>
      <Button onClick={()=>setOpenDialog(true)}>+ Create Form</Button>
      <Dialog open={openDialog}>
         
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create new form</DialogTitle>
            <DialogDescription>
            <Textarea  className="my-2" placeholder="Write description of your form"
                onChange={(event)=>setUserInput(event.target.value)}
            />
            <div className="flex gap-2 my-3 justify-end">
                <Button
                onClick={()=>setOpenDialog(false)}
                 variant="destructive">Cancel</Button>
                <Button 
                disabled={loading}
                onClick={()=>onCreateForm()}>
                {loading?
                <Loader2 className="animate-spin"/>:'Create'
                }
                </Button>
            </div>

            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default CreateForm;
