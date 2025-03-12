import React from 'react';
import { Container, PostForm } from '../components';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

function AddPost() {

    return (
        <div className='w-screen py-8'>
            <Container>
                <PostForm />
            </Container>
        </div>
    );
}

export default AddPost;


