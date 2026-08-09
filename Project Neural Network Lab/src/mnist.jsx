import * as tf from "@tensorflow/tfjs";

export async function loadMNIST(dataset_size) {
    console.log("Downloading MNIST");
    const response = await fetch(
        "https://cdn.hackclub.com/019fe424-002c-79b6-8c15-562e9eeea65a/mnist_handwritten_test.json"
    );
    const dataset = await response.json();
    console.log(
        "Samples:",
        dataset.length
    );
    const images = dataset.map(
        item => item.image
    ).slice(0, dataset_size);
    const labels = dataset.map(
        item => item.label
    ).slice(0, dataset_size);
    const xs = tf.tensor2d(
        images,
        [images.length,784]
    )
    .reshape([
        -1,
        28,
        28,
        1
    ]);
    console.log("Shape is [-1, 28, 28, 1]")


    const ys = tf.oneHot(
        tf.tensor1d(
            labels,
            "int32"
        ),
        10
    );


    return {
        xs,
        ys
    };
}
