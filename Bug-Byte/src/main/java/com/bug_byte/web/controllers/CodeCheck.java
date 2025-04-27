package com.bug_byte.web.controllers;

import com.bug_byte.web.model.CodeReq;

import java.io.*;
import java.util.ArrayList;
import java.util.List;


public class CodeCheck {
    public CodeCheck() {}

    public String compileJavaFile(File javaFile, CodeReq codeReq) {
        File classFile = null;
        try {
            String test = readCode(javaFile, codeReq.getRequirements());
            System.out.println(test);

            if(!test.equals("[]")) return test;

            //Makes the process for converting the java file to a class file
            ProcessBuilder processBuild = new ProcessBuilder();
            processBuild.directory(javaFile.getParentFile());
            processBuild.command("javac", javaFile.getName());
            processBuild.redirectErrorStream(true);

            //Reads the output of making a java file into a class file
            Process process = processBuild.start();
            String output = readOutput(process.getInputStream());

            //Sees if there is an error and returns it if there is.
            int exitValue = process.waitFor();
            if (exitValue != 0) {
                return "Compilation Error";
            }

            //Gets the class file so we can print out the output
            classFile = new File(javaFile.getParentFile(), javaFile.getName().replace(".java", ".class"));

            //Sets up the process to run the class file so we can see the output
            processBuild.command("java", classFile.getName().replace(".class", ""));
            process = processBuild.start();

            //saves the output and sees if there is an error value
            output = readOutput(process.getInputStream());
            exitValue = process.waitFor();

            //returns the output
            if (exitValue == 0) {
                System.out.println(output);
                if (output.contains(codeReq.getOutput())){
                    return "Correct";
                }
                return "Incorrect output";
            }
            else return "Compilation Error";
        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            if (classFile != null) classFile.delete();
            if (javaFile != null) javaFile.delete();
        }
        return "";
    }

    private static String readOutput (InputStream inputStream) throws IOException {
        //gets the reader so we read line by line
        BufferedReader reader = new BufferedReader(new InputStreamReader(inputStream));
        String line;

        //Allows to add string values line by line so we can return it as one
        StringBuilder output = new StringBuilder();

        //continues to read until there is no line to read
        while ((line = reader.readLine()) != null) {
            output.append(line).append("\n");
        }
        reader.close();

        //returns the output as a string
        return output.toString();
    }

    private static String readCode(File file, List<String> codeReqs) throws IOException {
        try (BufferedReader reader = new BufferedReader(new FileReader(file))) {
            String line;
            List<String> reqsMet = new ArrayList<>();
            while ((line = reader.readLine()) != null) {
                for(String req : codeReqs) {
                    if(line.contains(req)) reqsMet.add(req);
                }
            }
            codeReqs.removeAll(reqsMet);
            return codeReqs.toString();
        }

    }
}
